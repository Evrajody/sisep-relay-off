#/bin/sh

case $1 in

    dev)
      docker compose -f ./docker/composes/docker-compose.dev.yml down
      docker compose -f ./docker/composes/docker-compose.dev.yml build --no-cache
      docker compose -f ./docker/composes/docker-compose.dev.yml up -d ;;

    asin)
      docker compose -f ./docker/composes/docker-compose.asin.yml down
      docker compose -f ./docker/composes/docker-compose.asin.yml build --no-cache
      docker compose -f ./docker/composes/docker-compose.asin.yml up -d ;;

    pprod)
       docker compose -f ./docker/composes/docker-compose.pprod.yml down
       docker compose -f ./docker/composes/docker-compose.pprod.yml build --no-cache
       docker compose -f ./docker/composes/docker-compose.pprod.yml up -d ;;

    prod)
       docker compose -f ./docker/composes/prod/docker-compose.prod.yml down
       docker compose -f ./docker/composes/prod/docker-compose.prod.yml build --no-cache
       docker compose -f ./docker/composes/prod/docker-compose.prod.yml up -d ;;

    prod-admin)
      docker compose -f ./docker/composes/prod/docker-compose.prod.admin.yml down
      docker compose -f ./docker/composes/prod/docker-compose.prod.admin.yml build --no-cache
      docker compose -f ./docker/composes/prod/docker-compose.prod.admin.yml up -d ;;

    prod-apb)
       docker compose -f ./docker/composes/prod/docker-compose.prod.apb.yml down
       docker compose -f ./docker/composes/prod/docker-compose.prod.apb.yml build --no-cache
       docker compose -f ./docker/composes/prod/docker-compose.prod.apb.yml up -d ;;

    prod-magistrat)
       docker compose -f ./docker/composes/prod/docker-compose.prod.magistrat.yml down
       docker compose -f ./docker/composes/prod/docker-compose.prod.magistrat.yml build --no-cache
       docker compose -f ./docker/composes/prod/docker-compose.prod.magistrat.yml up -d ;;

    *)
      echo "=> Environnement non reconnu 🙄";;

esac
