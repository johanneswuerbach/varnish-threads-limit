build:
	docker-compose build --pull

start:
	docker-compose up -d varnish

stats:
	docker-compose exec varnish varnishstat

test:
	docker-compose run --rm k6 run /app/k6s.js
