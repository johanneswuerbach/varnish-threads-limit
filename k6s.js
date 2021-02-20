import { check } from 'k6';
import http from 'k6/http';

export let options = {
  discardResponseBodies: true,
  scenarios: {
    test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 },
        { duration: '10s', target: 5000 },
        { duration: '30s', target: 5000 },
      ],
      gracefulRampDown: '30s',
    },
  }
}

// Our test is a simple token lookup GET
export default function (data) {
  const res = http.get(
    'http://varnish:80/space-abc',
    {
      headers: {
        'Host': 'cdn.varnish',
        'cf-cache-name': 'content_delivery',
        'cf-response-timeout': '5000'
      }
    }
  );

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}
