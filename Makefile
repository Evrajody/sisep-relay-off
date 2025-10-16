.PHONY: help deploy-dev deploy-asin deploy-pprod deploy-prod \
        down-dev down-asin down-pprod down-prod \
        restart-dev restart-asin restart-pprod restart-prod \
        logs-dev logs-asin logs-pprod logs-prod \
        status-dev status-asin status-pprod status-prod \
        health-dev health-asin health-pprod health-prod \
        ps-dev ps-asin ps-pprod ps-prod \
        clean-dev clean-asin clean-pprod clean-prod \
        build-dev build-asin build-pprod build-prod

# Variables
COMPOSE_DEV := docker/composes/docker-compose.dev.yml
COMPOSE_ASIN := docker/composes/docker-compose.asin.yml
COMPOSE_PPROD := docker/composes/docker-compose.pprod.yml
COMPOSE_PROD := docker/composes/docker-compose.prod.yml

# Couleurs pour l'affichage
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ Aide

help: ## Affiche cette aide
	@echo "$(GREEN)Makefile de déploiement SISEB$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Déploiement

deploy-dev: ## Déployer l'environnement DEV (down, build, up)
	@echo "$(YELLOW)Déploiement de l'environnement DEV...$(NC)"
	docker compose -f $(COMPOSE_DEV) down
	docker compose -f $(COMPOSE_DEV) build
	docker compose -f $(COMPOSE_DEV) up -d
	@echo "$(GREEN)Déploiement DEV terminé !$(NC)"
	@make health-dev

deploy-asin: ## Déployer l'environnement ASIN (down, build, up)
	@echo "$(YELLOW)Déploiement de l'environnement ASIN...$(NC)"
	docker compose -f $(COMPOSE_ASIN) down
	docker compose -f $(COMPOSE_ASIN) build
	docker compose -f $(COMPOSE_ASIN) up -d
	@echo "$(GREEN)Déploiement ASIN terminé !$(NC)"
	@make health-asin

deploy-pprod: ## Déployer l'environnement PPROD (down, build, up)
	@echo "$(YELLOW)Déploiement de l'environnement PPROD...$(NC)"
	docker compose -f $(COMPOSE_PPROD) down
	docker compose -f $(COMPOSE_PPROD) build
	docker compose -f $(COMPOSE_PPROD) up -d
	@echo "$(GREEN)Déploiement PPROD terminé !$(NC)"
	@make health-pprod

deploy-prod: ## Déployer l'environnement PROD (down, build, up)
	@echo "$(YELLOW)Déploiement de l'environnement PROD...$(NC)"
	docker compose -f $(COMPOSE_PROD) down
	docker compose -f $(COMPOSE_PROD) build
	docker compose -f $(COMPOSE_PROD) up -d
	@echo "$(GREEN)Déploiement PROD terminé !$(NC)"
	@make health-prod

##@ Build

build-dev: ## Builder les images DEV sans déployer
	@echo "$(YELLOW)Build des images DEV...$(NC)"
	docker compose -f $(COMPOSE_DEV) build

build-asin: ## Builder les images ASIN sans déployer
	@echo "$(YELLOW)Build des images ASIN...$(NC)"
	docker compose -f $(COMPOSE_ASIN) build

build-pprod: ## Builder les images PPROD sans déployer
	@echo "$(YELLOW)Build des images PPROD...$(NC)"
	docker compose -f $(COMPOSE_PPROD) build

build-prod: ## Builder les images PROD sans déployer
	@echo "$(YELLOW)Build des images PROD...$(NC)"
	docker compose -f $(COMPOSE_PROD) build

##@ Contrôle des services

down-dev: ## Arrêter l'environnement DEV
	@echo "$(YELLOW)Arrêt de l'environnement DEV...$(NC)"
	docker compose -f $(COMPOSE_DEV) down

down-asin: ## Arrêter l'environnement ASIN
	@echo "$(YELLOW)Arrêt de l'environnement ASIN...$(NC)"
	docker compose -f $(COMPOSE_ASIN) down

down-pprod: ## Arrêter l'environnement PPROD
	@echo "$(YELLOW)Arrêt de l'environnement PPROD...$(NC)"
	docker compose -f $(COMPOSE_PPROD) down

down-prod: ## Arrêter l'environnement PROD
	@echo "$(YELLOW)Arrêt de l'environnement PROD...$(NC)"
	docker compose -f $(COMPOSE_PROD) down

restart-dev: ## Redémarrer l'environnement DEV
	@echo "$(YELLOW)Redémarrage de l'environnement DEV...$(NC)"
	docker compose -f $(COMPOSE_DEV) restart
	@make health-dev

restart-asin: ## Redémarrer l'environnement ASIN
	@echo "$(YELLOW)Redémarrage de l'environnement ASIN...$(NC)"
	docker compose -f $(COMPOSE_ASIN) restart
	@make health-asin

restart-pprod: ## Redémarrer l'environnement PPROD
	@echo "$(YELLOW)Redémarrage de l'environnement PPROD...$(NC)"
	docker compose -f $(COMPOSE_PPROD) restart
	@make health-pprod

restart-prod: ## Redémarrer l'environnement PROD
	@echo "$(YELLOW)Redémarrage de l'environnement PROD...$(NC)"
	docker compose -f $(COMPOSE_PROD) restart
	@make health-prod

##@ Logs et monitoring

logs-dev: ## Afficher les logs de l'environnement DEV
	docker compose -f $(COMPOSE_DEV) logs -f

logs-asin: ## Afficher les logs de l'environnement ASIN
	docker compose -f $(COMPOSE_ASIN) logs -f

logs-pprod: ## Afficher les logs de l'environnement PPROD
	docker compose -f $(COMPOSE_PPROD) logs -f

logs-prod: ## Afficher les logs de l'environnement PROD
	docker compose -f $(COMPOSE_PROD) logs -f

ps-dev: ## Lister les conteneurs de l'environnement DEV
	docker compose -f $(COMPOSE_DEV) ps

ps-asin: ## Lister les conteneurs de l'environnement ASIN
	docker compose -f $(COMPOSE_ASIN) ps

ps-pprod: ## Lister les conteneurs de l'environnement PPROD
	docker compose -f $(COMPOSE_PPROD) ps

ps-prod: ## Lister les conteneurs de l'environnement PROD
	docker compose -f $(COMPOSE_PROD) ps

##@ Vérification de santé

status-dev: ## Vérifier le statut des services DEV
	@echo "$(YELLOW)=== Statut des services DEV ===$(NC)"
	@docker compose -f $(COMPOSE_DEV) ps

status-asin: ## Vérifier le statut des services ASIN
	@echo "$(YELLOW)=== Statut des services ASIN ===$(NC)"
	@docker compose -f $(COMPOSE_ASIN) ps

status-pprod: ## Vérifier le statut des services PPROD
	@echo "$(YELLOW)=== Statut des services PPROD ===$(NC)"
	@docker compose -f $(COMPOSE_PPROD) ps

status-prod: ## Vérifier le statut des services PROD
	@echo "$(YELLOW)=== Statut des services PROD ===$(NC)"
	@docker compose -f $(COMPOSE_PROD) ps

health-dev: ## Vérifier la santé des services DEV (statut + logs récents)
	@echo "$(YELLOW)=== Vérification de santé DEV ===$(NC)"
	@docker compose -f $(COMPOSE_DEV) ps
	@echo ""
	@echo "$(YELLOW)=== Logs récents (dernières 20 lignes) ===$(NC)"
	@docker compose -f $(COMPOSE_DEV) logs --tail=20
	@echo ""
	@if docker compose -f $(COMPOSE_DEV) ps | grep -q "Up"; then \
		echo "$(GREEN)✓ Services DEV en cours d'exécution$(NC)"; \
	else \
		echo "$(RED)✗ Problème détecté avec les services DEV$(NC)"; \
	fi

health-asin: ## Vérifier la santé des services ASIN (statut + logs récents)
	@echo "$(YELLOW)=== Vérification de santé ASIN ===$(NC)"
	@docker compose -f $(COMPOSE_ASIN) ps
	@echo ""
	@echo "$(YELLOW)=== Logs récents (dernières 20 lignes) ===$(NC)"
	@docker compose -f $(COMPOSE_ASIN) logs --tail=20
	@echo ""
	@if docker compose -f $(COMPOSE_ASIN) ps | grep -q "Up"; then \
		echo "$(GREEN)✓ Services ASIN en cours d'exécution$(NC)"; \
	else \
		echo "$(RED)✗ Problème détecté avec les services ASIN$(NC)"; \
	fi

health-pprod: ## Vérifier la santé des services PPROD (statut + logs récents)
	@echo "$(YELLOW)=== Vérification de santé PPROD ===$(NC)"
	@docker compose -f $(COMPOSE_PPROD) ps
	@echo ""
	@echo "$(YELLOW)=== Logs récents (dernières 20 lignes) ===$(NC)"
	@docker compose -f $(COMPOSE_PPROD) logs --tail=20
	@echo ""
	@if docker compose -f $(COMPOSE_PPROD) ps | grep -q "Up"; then \
		echo "$(GREEN)✓ Services PPROD en cours d'exécution$(NC)"; \
	else \
		echo "$(RED)✗ Problème détecté avec les services PPROD$(NC)"; \
	fi

health-prod: ## Vérifier la santé des services PROD (statut + logs récents)
	@echo "$(YELLOW)=== Vérification de santé PROD ===$(NC)"
	@docker compose -f $(COMPOSE_PROD) ps
	@echo ""
	@echo "$(YELLOW)=== Logs récents (dernières 20 lignes) ===$(NC)"
	@docker compose -f $(COMPOSE_PROD) logs --tail=20
	@echo ""
	@if docker compose -f $(COMPOSE_PROD) ps | grep -q "Up"; then \
		echo "$(GREEN)✓ Services PROD en cours d'exécution$(NC)"; \
	else \
		echo "$(RED)✗ Problème détecté avec les services PROD$(NC)"; \
	fi

##@ Nettoyage

clean-dev: ## Nettoyer l'environnement DEV (down + suppression volumes)
	@echo "$(YELLOW)Nettoyage de l'environnement DEV...$(NC)"
	docker compose -f $(COMPOSE_DEV) down -v
	@echo "$(GREEN)Nettoyage DEV terminé !$(NC)"

clean-asin: ## Nettoyer l'environnement ASIN (down + suppression volumes)
	@echo "$(YELLOW)Nettoyage de l'environnement ASIN...$(NC)"
	docker compose -f $(COMPOSE_ASIN) down -v
	@echo "$(GREEN)Nettoyage ASIN terminé !$(NC)"

clean-pprod: ## Nettoyer l'environnement PPROD (down + suppression volumes)
	@echo "$(YELLOW)Nettoyage de l'environnement PPROD...$(NC)"
	docker compose -f $(COMPOSE_PPROD) down -v
	@echo "$(GREEN)Nettoyage PPROD terminé !$(NC)"

clean-prod: ## Nettoyer l'environnement PROD (down + suppression volumes)
	@echo "$(YELLOW)Nettoyage de l'environnement PROD...$(NC)"
	docker compose -f $(COMPOSE_PROD) down -v
	@echo "$(GREEN)Nettoyage PROD terminé !$(NC)"

clean-all: ## Nettoyer tous les environnements
	@echo "$(YELLOW)Nettoyage de tous les environnements...$(NC)"
	@make clean-dev
	@make clean-asin
	@make clean-pprod
	@make clean-prod
	@echo "$(GREEN)Nettoyage complet terminé !$(NC)"

##@ Utilitaires

check-network: ## Vérifier si le réseau Docker siseb existe
	@echo "$(YELLOW)Vérification du réseau Docker 'siseb'...$(NC)"
	@if docker network ls | grep -q siseb; then \
		echo "$(GREEN)✓ Le réseau 'siseb' existe$(NC)"; \
	else \
		echo "$(RED)✗ Le réseau 'siseb' n'existe pas$(NC)"; \
		echo "$(YELLOW)Création du réseau 'siseb'...$(NC)"; \
		docker network create siseb; \
		echo "$(GREEN)✓ Réseau 'siseb' créé$(NC)"; \
	fi

stats: ## Afficher les statistiques des conteneurs en cours d'exécution
	@echo "$(YELLOW)=== Statistiques des conteneurs SISEB ===$(NC)"
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" $$(docker ps --filter "name=siseb" -q)

inspect-dev: ## Inspecter la configuration de l'environnement DEV
	docker compose -f $(COMPOSE_DEV) config

inspect-asin: ## Inspecter la configuration de l'environnement ASIN
	docker compose -f $(COMPOSE_ASIN) config

inspect-pprod: ## Inspecter la configuration de l'environnement PPROD
	docker compose -f $(COMPOSE_PPROD) config

inspect-prod: ## Inspecter la configuration de l'environnement PROD
	docker compose -f $(COMPOSE_PROD) config
