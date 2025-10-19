# Exemples d'Utilisation du Système de Refresh Token

Ce document contient des exemples concrets d'utilisation du système de refresh token dans différents scénarios.

---

## 📋 Table des Matières

1. [Exemple 1 : Composant Simple avec API Call](#exemple-1--composant-simple-avec-api-call)
2. [Exemple 2 : Liste d'Utilisateurs avec CRUD](#exemple-2--liste-dutilisateurs-avec-crud)
3. [Exemple 3 : Plugin Nuxt avec Intercepteur Global](#exemple-3--plugin-nuxt-avec-intercepteur-global)
4. [Exemple 4 : Composable Personnalisé pour votre API](#exemple-4--composable-personnalisé-pour-votre-api)
5. [Exemple 5 : Gestion d'Erreurs Avancée](#exemple-5--gestion-derreurs-avancée)

---

## Exemple 1 : Composant Simple avec API Call

**Scénario** : Afficher les données d'un utilisateur en gérant automatiquement le refresh.

```vue
<!-- pages/admin/user-profile.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTokenRefresh } from '~/composables/useTokenRefresh';

definePageMeta({
    middleware: 'auth'
});

// Utiliser le composable de refresh token
const { fetchWithTokenRefresh } = useTokenRefresh();

const user = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const loadUserProfile = async () => {
    loading.value = true;
    error.value = null;

    try {
        // Cette requête gérera automatiquement le refresh si le token est expiré
        user.value = await fetchWithTokenRefresh('/auth/profile', {
            method: 'GET',
            baseURL: 'https://siseb-refonte.emes.bj/api'
        });

        console.log('Profil chargé:', user.value);

    } catch (err: any) {
        console.error('Erreur lors du chargement du profil:', err);
        error.value = err.message || 'Erreur lors du chargement du profil';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadUserProfile();
});
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Mon Profil</h1>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
            <span>Chargement...</span>
        </div>

        <!-- Erreur -->
        <UAlert
            v-else-if="error"
            color="red"
            variant="subtle"
            :title="error"
            icon="i-heroicons-exclamation-triangle"
        />

        <!-- Données -->
        <UCard v-else-if="user">
            <div class="space-y-4">
                <div>
                    <label class="text-sm font-medium text-gray-600">Nom</label>
                    <p class="text-lg">{{ user.name }}</p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-600">Email</label>
                    <p class="text-lg">{{ user.email }}</p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-600">Rôle</label>
                    <UBadge color="blue">{{ user.role }}</UBadge>
                </div>
            </div>
        </UCard>
    </div>
</template>
```

**Ce qui se passe automatiquement** :
1. Si l'access token est valide → Requête réussit normalement
2. Si l'access token est expiré (401) → Refresh automatique → Requête réessayée → Succès
3. Si le refresh token est expiré → Redirection vers `/admin/login`

---

## Exemple 2 : Liste d'Utilisateurs avec CRUD

**Scénario** : Gérer une liste d'utilisateurs avec Create, Read, Update, Delete.

```vue
<!-- pages/admin/users/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createApiClient } from '~/composables/useTokenRefresh';

definePageMeta({
    middleware: 'auth'
});

// Créer un client API avec gestion automatique du refresh
const api = createApiClient('https://siseb-refonte.emes.bj/api');

const users = ref<any[]>([]);
const loading = ref(false);
const selectedUser = ref<any>(null);
const isModalOpen = ref(false);

// ========================================
// READ - Charger la liste des utilisateurs
// ========================================
const fetchUsers = async () => {
    loading.value = true;
    try {
        users.value = await api.get('/users');
        console.log('Utilisateurs chargés:', users.value.length);
    } catch (error: any) {
        console.error('Erreur lors du chargement:', error);
        // Le refresh a déjà été tenté automatiquement
        // Si on arrive ici, c'est que le refresh a échoué
    } finally {
        loading.value = false;
    }
};

// ========================================
// CREATE - Créer un nouvel utilisateur
// ========================================
const createUser = async (userData: any) => {
    try {
        const newUser = await api.post('/users', userData);
        users.value.push(newUser);
        isModalOpen.value = false;

        // Notification de succès
        console.log('Utilisateur créé:', newUser);
    } catch (error: any) {
        console.error('Erreur lors de la création:', error);
    }
};

// ========================================
// UPDATE - Mettre à jour un utilisateur
// ========================================
const updateUser = async (userId: string, userData: any) => {
    try {
        const updated = await api.put(`/users/${userId}`, userData);

        // Mettre à jour dans la liste locale
        const index = users.value.findIndex(u => u.id === userId);
        if (index !== -1) {
            users.value[index] = updated;
        }

        isModalOpen.value = false;
        console.log('Utilisateur mis à jour:', updated);
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour:', error);
    }
};

// ========================================
// DELETE - Supprimer un utilisateur
// ========================================
const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        return;
    }

    try {
        await api.delete(`/users/${userId}`);

        // Retirer de la liste locale
        users.value = users.value.filter(u => u.id !== userId);

        console.log('Utilisateur supprimé');
    } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
    }
};

// Ouvrir le modal pour créer/éditer
const openModal = (user: any = null) => {
    selectedUser.value = user;
    isModalOpen.value = true;
};

// Sauvegarder (créer ou mettre à jour)
const handleSave = async (userData: any) => {
    if (selectedUser.value) {
        await updateUser(selectedUser.value.id, userData);
    } else {
        await createUser(userData);
    }
};

onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <div class="p-6">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">Gestion des Utilisateurs</h1>
            <UButton
                icon="i-heroicons-plus"
                @click="openModal()"
            >
                Nouvel utilisateur
            </UButton>
        </div>

        <!-- Liste des utilisateurs -->
        <UCard>
            <div v-if="loading" class="text-center py-8">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 mx-auto" />
                <p class="mt-2 text-gray-600">Chargement...</p>
            </div>

            <div v-else class="divide-y">
                <div
                    v-for="user in users"
                    :key="user.id"
                    class="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                    <div>
                        <p class="font-medium">{{ user.name }}</p>
                        <p class="text-sm text-gray-600">{{ user.email }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-pencil"
                            color="gray"
                            variant="ghost"
                            size="sm"
                            @click="openModal(user)"
                        />
                        <UButton
                            icon="i-heroicons-trash"
                            color="red"
                            variant="ghost"
                            size="sm"
                            @click="deleteUser(user.id)"
                        />
                    </div>
                </div>
            </div>
        </UCard>

        <!-- Modal de création/édition -->
        <UModal v-model="isModalOpen">
            <UCard>
                <template #header>
                    <h3 class="text-lg font-semibold">
                        {{ selectedUser ? 'Modifier' : 'Créer' }} un utilisateur
                    </h3>
                </template>

                <!-- Formulaire ici -->
                <!-- ... -->
            </UCard>
        </UModal>
    </div>
</template>
```

**Avantages de cette approche** :
- ✅ Toutes les opérations CRUD gèrent automatiquement le refresh
- ✅ Code simple et lisible
- ✅ Pas de duplication de logique de refresh

---

## Exemple 3 : Plugin Nuxt avec Intercepteur Global

**Scénario** : Configurer un intercepteur global pour TOUTES les requêtes de l'application.

```typescript
// plugins/api-interceptor.client.ts

import { useTokenRefresh } from '~/composables/useTokenRefresh';

export default defineNuxtPlugin((nuxtApp) => {
    const { refreshToken, isRefreshing } = useTokenRefresh();

    // Intercepteur global pour $fetch
    if (process.client) {
        const originalFetch = globalThis.$fetch;

        globalThis.$fetch = async (url: any, options: any = {}) => {
            try {
                // Première tentative
                return await originalFetch(url, options);

            } catch (error: any) {
                // Si erreur 401 et pas déjà en train de rafraîchir
                if ((error.statusCode === 401 || error.status === 401) && !isRefreshing.value) {
                    console.log('[Global Interceptor] Erreur 401 détectée, refresh du token...');

                    const refreshed = await refreshToken();

                    if (refreshed) {
                        console.log('[Global Interceptor] Token rafraîchi, nouvelle tentative...');
                        // Réessayer la requête originale
                        return await originalFetch(url, options);
                    } else {
                        console.error('[Global Interceptor] Impossible de rafraîchir le token');
                    }
                }

                // Autres erreurs ou refresh échoué
                throw error;
            }
        };

        console.log('[API Interceptor] Intercepteur global installé');
    }
});
```

**Utilisation** : Avec ce plugin, TOUTES les requêtes $fetch gèrent automatiquement le refresh !

```vue
<script setup>
// Plus besoin d'utiliser fetchWithTokenRefresh !
// Le plugin gère tout automatiquement

const users = await $fetch('/api/users', {
    baseURL: 'https://api.example.com'
});
// Si token expiré → Refresh automatique → Requête réessayée
</script>
```

---

## Exemple 4 : Composable Personnalisé pour votre API

**Scénario** : Créer un composable spécifique pour votre API SISEB.

```typescript
// composables/useSisebApi.ts

import { createApiClient } from '~/composables/useTokenRefresh';

export const useSisebApi = () => {
    const config = useRuntimeConfig();
    const api = createApiClient(config.public.sisebApiBaseUrl);

    // ========================================
    // PROJETS
    // ========================================
    const projects = {
        // Lister tous les projets
        list: async (filters?: any) => {
            const query = new URLSearchParams(filters || {}).toString();
            return await api.get(`/projects?${query}`);
        },

        // Récupérer un projet par ID
        get: async (id: string) => {
            return await api.get(`/projects/${id}`);
        },

        // Créer un projet
        create: async (data: any) => {
            return await api.post('/projects', data);
        },

        // Mettre à jour un projet
        update: async (id: string, data: any) => {
            return await api.put(`/projects/${id}`, data);
        },

        // Supprimer un projet
        delete: async (id: string) => {
            return await api.delete(`/projects/${id}`);
        },
    };

    // ========================================
    // UTILISATEURS
    // ========================================
    const users = {
        list: async () => api.get('/users'),
        get: async (id: string) => api.get(`/users/${id}`),
        create: async (data: any) => api.post('/users', data),
        update: async (id: string, data: any) => api.put(`/users/${id}`, data),
        delete: async (id: string) => api.delete(`/users/${id}`),
    };

    // ========================================
    // STATISTIQUES
    // ========================================
    const stats = {
        dashboard: async () => api.get('/stats/dashboard'),
        projects: async () => api.get('/stats/projects'),
        users: async () => api.get('/stats/users'),
    };

    return {
        projects,
        users,
        stats,
    };
};
```

**Utilisation dans un composant** :

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSisebApi } from '~/composables/useSisebApi';

const siseb = useSisebApi();

const projects = ref([]);
const loading = ref(false);

const loadProjects = async () => {
    loading.value = true;
    try {
        // Appel simple et clair !
        // Le refresh est géré automatiquement
        projects.value = await siseb.projects.list({
            status: 'PUBLISHED',
            limit: 10
        });
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};

const createProject = async (projectData: any) => {
    try {
        const newProject = await siseb.projects.create(projectData);
        projects.value.push(newProject);
    } catch (error) {
        console.error('Erreur:', error);
    }
};

onMounted(() => {
    loadProjects();
});
</script>

<template>
    <div>
        <h1>Mes Projets</h1>

        <div v-if="loading">Chargement...</div>

        <div v-else>
            <div v-for="project in projects" :key="project.id">
                {{ project.title }}
            </div>
        </div>
    </div>
</template>
```

**Avantages** :
- ✅ API unifiée et typée
- ✅ Refresh automatique sur toutes les requêtes
- ✅ Code réutilisable
- ✅ Facile à tester

---

## Exemple 5 : Gestion d'Erreurs Avancée

**Scénario** : Gérer finement les erreurs et afficher des messages appropriés.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useTokenRefresh } from '~/composables/useTokenRefresh';

const { fetchWithTokenRefresh, isRefreshing } = useTokenRefresh();

const data = ref(null);
const error = ref<{
    type: 'network' | 'auth' | 'server' | 'unknown';
    message: string;
} | null>(null);

const loadData = async () => {
    error.value = null;

    try {
        data.value = await fetchWithTokenRefresh('/api/sensitive-data', {
            method: 'GET',
            baseURL: 'https://api.example.com'
        });

    } catch (err: any) {
        console.error('Erreur:', err);

        // Classifier l'erreur
        if (err.message?.includes('fetch failed') || err.message?.includes('network')) {
            error.value = {
                type: 'network',
                message: 'Erreur de connexion. Vérifiez votre connexion Internet.'
            };
        } else if (err.statusCode === 401 || err.status === 401) {
            error.value = {
                type: 'auth',
                message: 'Session expirée. Veuillez vous reconnecter.'
            };
            // Rediriger après 2 secondes
            setTimeout(() => navigateTo('/admin/login'), 2000);
        } else if (err.statusCode === 403 || err.status === 403) {
            error.value = {
                type: 'auth',
                message: 'Vous n\'avez pas les permissions nécessaires.'
            };
        } else if (err.statusCode === 500 || err.status === 500) {
            error.value = {
                type: 'server',
                message: 'Erreur serveur. Veuillez réessayer plus tard.'
            };
        } else {
            error.value = {
                type: 'unknown',
                message: 'Une erreur inattendue s\'est produite.'
            };
        }
    }
};

// Fonction de retry
const retry = () => {
    loadData();
};
</script>

<template>
    <div class="p-6">
        <!-- Indicateur de refresh en cours -->
        <UAlert
            v-if="isRefreshing"
            color="blue"
            variant="subtle"
            icon="i-heroicons-arrow-path"
            title="Rafraîchissement de la session..."
            description="Veuillez patienter..."
        />

        <!-- Erreur réseau -->
        <UAlert
            v-else-if="error?.type === 'network'"
            color="orange"
            variant="subtle"
            icon="i-heroicons-wifi"
            :title="error.message"
        >
            <template #actions>
                <UButton
                    color="orange"
                    variant="ghost"
                    size="sm"
                    @click="retry"
                >
                    Réessayer
                </UButton>
            </template>
        </UAlert>

        <!-- Erreur d'authentification -->
        <UAlert
            v-else-if="error?.type === 'auth'"
            color="red"
            variant="subtle"
            icon="i-heroicons-shield-exclamation"
            :title="error.message"
        />

        <!-- Erreur serveur -->
        <UAlert
            v-else-if="error?.type === 'server'"
            color="red"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle"
            :title="error.message"
        >
            <template #actions>
                <UButton
                    color="red"
                    variant="ghost"
                    size="sm"
                    @click="retry"
                >
                    Réessayer
                </UButton>
            </template>
        </UAlert>

        <!-- Erreur inconnue -->
        <UAlert
            v-else-if="error?.type === 'unknown'"
            color="gray"
            variant="subtle"
            icon="i-heroicons-question-mark-circle"
            :title="error.message"
        />

        <!-- Données chargées -->
        <div v-else-if="data">
            <pre>{{ data }}</pre>
        </div>

        <!-- Bouton de chargement -->
        <UButton
            v-if="!data && !error"
            @click="loadData"
        >
            Charger les données
        </UButton>
    </div>
</template>
```

**Points clés** :
- ✅ Distinction claire entre types d'erreurs
- ✅ Messages utilisateur appropriés
- ✅ Actions de retry
- ✅ Indicateur visuel lors du refresh

---

## 🎯 Résumé des Meilleures Pratiques

### ✅ À FAIRE

1. **Utiliser `createApiClient`** pour créer un client API réutilisable
2. **Créer des composables métier** (comme `useSisebApi`) pour encapsuler la logique
3. **Gérer les erreurs proprement** avec des messages clairs
4. **Toujours inclure `credentials: 'include'`** dans les options de fetch
5. **Logger les erreurs** pour faciliter le debugging

### ❌ À ÉVITER

1. **Ne pas** dupliquer la logique de refresh dans chaque composant
2. **Ne pas** ignorer les erreurs de refresh
3. **Ne pas** créer des boucles infinies de refresh
4. **Ne pas** exposer les tokens dans les logs en production

---

**Créé par** : Claude Code
**Date** : 2025-01-19
**Voir aussi** : [TOKEN_REFRESH_GUIDE.md](TOKEN_REFRESH_GUIDE.md)
