vcl 4.0;

import std;

backend default {
  # Unresolvable names lead to crashes.
  .host = "test-backend";
  .port = "3000";
}

sub vcl_synth {
  if (resp.status == 700) {
    set resp.http.Content-Type = "text/plain; charset=utf-8";
    set resp.status = 200;
    synthetic({"
Varnish OK
"});
  }

  return(deliver);
}

sub vcl_deliver {}

sub vcl_hash {
  hash_data(req.http.authorization);
  hash_data(req.http.content-type);
  hash_data(req.http.host);
  hash_data(req.method);
}

sub vcl_backend_response {
  set beresp.do_stream = false;
  set beresp.do_gzip = false;

  if (beresp.http.cf-cache-name && (beresp.status == 200 || beresp.status == 204 || beresp.status == 304)) {
    set beresp.ttl = 24h;
    set beresp.grace = 30m;
  } else {
    if (beresp.http.cf-cache-name && bereq.retries < 1 && (beresp.status == 500 || beresp.status == 503)) {
      return(retry);
    }
    else {
      set beresp.ttl = 0s;
    }
  }
}

sub vcl_recv {
  if (req.url == "/internal/health") {
    return (synth(700, "OK"));
  }

  set req.backend_hint = default;
  if (req.method == "GET" || req.method == "HEAD") {
    return(hash);
  }
  return(pass);

  return (synth(403, "unknown host"));
}
