#/bin/sh

case $1 in

    dev)
      docker compose -f ./docker/composes/docker-compose.dev.yml down
      docker compose -f ./docker/composes/docker-compose.dev.yml build
      docker compose -f ./docker/composes/docker-compose.dev.yml up -d ;;

    asin)
      docker compose -f ./docker/composes/docker-compose.asin.yml down
      docker compose -f ./docker/composes/docker-compose.asin.yml build
      docker compose -f ./docker/composes/docker-compose.asin.yml up -d ;;

    pprod)
       docker compose -f ./docker/composes/docker-compose.pprod.yml down
       docker compose -f ./docker/composes/docker-compose.pprod.yml build
       docker compose -f ./docker/composes/docker-compose.pprod.yml up -d ;;

    prod)
       docker compose -f ./docker/composes/docker-compose.prod.yml down
       docker compose -f ./docker/composes/docker-compose.prod.yml build
       docker compose -f ./docker/composes/docker-compose.prod.yml up -d ;;

    *)
      echo "=> Environnement non reconnu 🙄";;

esac
