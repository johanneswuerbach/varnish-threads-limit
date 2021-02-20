FROM debian:buster-20210111-slim

RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    rm -rf /var/lib/apt/lists/*

RUN echo "deb https://packagecloud.io/varnishcache/varnish65/debian buster main" > /etc/apt/sources.list.d/varnish-cache.list && \
    curl -L https://packagecloud.io/varnishcache/varnish65/gpgkey | apt-key add - && \
    apt-get update && \
    apt-get install -y varnish && \
    rm -rf /var/lib/apt/lists/*

COPY config.vcl /etc/varnishconf/

# Thread parameter tuning guidelines
# https://book.varnish-software.com/4.0/chapters/Tuning.html#threading-parameters

CMD ["varnishd", "-F", "-f", "/etc/varnishconf/config.vcl", "-s", "malloc,64m", "-p", "thread_pool_max=10000"]

EXPOSE 80
