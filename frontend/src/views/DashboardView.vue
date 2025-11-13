<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Система управления дефектами</h1>
      <div class="user-info">
        <div class="user-mini">
          <span class="user-name">{{ user.fullName }}</span>
          <span class="user-role-badge" :class="user.role.name">
            {{ getRoleName(user.role.name) }}
          </span>
        </div>
        <button @click="handleLogout" class="logout-button">Выйти</button>
      </div>
    </header>
    
    <main class="dashboard-content">
      <!-- Левая колонка: пользователь и быстрые действия -->
      <div class="left-column">
        <div class="user-card-compact">
          <div class="user-main-info">
            <h2>{{ user.fullName }}</h2>
            <p class="user-email">{{ user.email }}</p>
          </div>
          <div class="user-additional-info">
            <div class="info-item">
              <span class="info-label">Роль:</span>
              <span class="role-badge" :class="user.role.name">
                {{ getRoleName(user.role.name) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Статус:</span>
              <span class="status-badge" :class="{ active: user.isActive }">
                {{ user.isActive ? 'Активен' : 'Неактивен' }}
              </span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Быстрые действия</h3>
          <div class="actions-grid">
            <button v-for="action in getQuickActions(user.role.name)" 
                    :key="action.id"
                    class="action-button"
                    @click="handleAction(action.id)">
              <span class="action-text">{{ action.text }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Правая колонка: функции -->
      <div class="functions-card">
        <h3>Доступные функции</h3>
        <div class="functions-list">
          <div v-for="functionItem in getRoleFunctions(user.role.name)" 
               :key="functionItem.id"
               class="function-item">
            <div class="function-content">
              <h4>{{ functionItem.title }}</h4>
              <p>{{ functionItem.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      user: {
        id: 0,
        fullName: '',
        email: '',
        roleId: 0,
        isActive: false,
        role: {
          id: 0,
          name: ''
        }
      }
    }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          this.user = parsedUser
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    },

    getRoleName(roleName) {
      const roles = {
        'manager': 'Менеджер',
        'engineer': 'Инженер',
        'observer': 'Наблюдатель'
      }
      return roles[roleName] || roleName
    },

    getRoleFunctions(roleName) {
      const functions = {
        'manager': [
          {
            id: 1,
            title: 'Управление объектами',
            description: 'Создание, редактирование и просмотр строительных объектов'
          },
          {
            id: 2,
            title: 'Управление дефектами',
            description: 'Регистрация, редактирование и просмотр новых дефектов'
          },
          {
            id: 3,
            title: 'Управление пользователями',
            description: 'Создание и удаление пользователей'
          },
          {
            id: 4,
            title: 'Контроль выполнения',
            description: 'Проверка и закрытие выполненных дефектов'
          },
          {
            id: 5,
            title: 'Формирование отчетов',
            description: 'Создание аналитических отчетов для руководства'
          }
        ],
        'engineer': [
          {
            id: 1,
            title: 'Управление дефектами',
            description: 'Доступ к списку дефектов, назначенных Вам, а так же их изменение'
          },
          {
            id: 2,
            title: 'Просмотр объектов',
            description: 'Доступ к списку объектов'
          }
        ],
        'observer': [
          {
            id: 1,
            title: 'Просмотр объектов',
            description: 'Просмотр строительных объектов, принадлежащих Вам'
          },
          {
            id: 2,
            title: 'Просмотр дефектов',
            description: 'Просмотр всех зарегистрированных дефектов'
          },
          {
            id: 3,
            title: 'Мониторинг прогресса',
            description: 'Отслеживание статусов выполнения работ по объектам'
          },
          {
            id: 4,
            title: 'Просмотр отчетов',
            description: 'Доступ к аналитическим отчетам и статистике'
          }
        ]
      }
      return functions[roleName] || []
    },

    getQuickActions(roleName) {
      const actions = {
        'manager': [
          { id: 'users', text: 'Управление пользователями' }, // Добавляем эту строку
          { id: 'projects', text: 'Управление объектами' },
          { id: 'create_defect', text: 'Создать дефект' },
        ],
        'engineer': [
          { id: 'my_defects', text: 'Мои дефекты' },
          { id: 'in_progress', text: 'Дефекты в работе' },
          { id: 'for_review', text: 'На проверке' }
        ],
        'observer': [
          { id: 'projects', text: 'Объекты' },
          { id: 'view_defects', text: 'Все дефекты' },
          { id: 'reports', text: 'Отчеты' }
        ]
      }
      return actions[roleName] || []
    },

    handleAction(actionId) {
      const actions = {
        'users': () => this.$router.push('/admin/users'),
        'projects': () => this.$router.push('/projects'),
        'create_defect': () => this.$router.push('/defects/create'),
        'view_defects': () => this.$router.push('/defects'),
        'reports': () => this.$router.push('/reports'),
        'my_defects': () => this.$router.push('/defects/my'),
        'in_progress': () => this.$router.push('/defects?status=in_progress'),
        'for_review': () => this.$router.push('/defects?status=in_review')
      }
      
      if (actions[actionId]) {
        actions[actionId]()
      }
    },

    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  color: #2d3748;
  margin: 0;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-mini {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  color: #4a5568;
  font-weight: 600;
}

.user-role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.user-role-badge.manager {
  background: #bee3f8;
  color: #2c5282;
}

.user-role-badge.engineer {
  background: #c6f6d5;
  color: #276749;
}

.user-role-badge.observer {
  background: #faf089;
  color: #744210;
}

.logout-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
  font-size: 14px;
}

.logout-button:hover {
  background: #c53030;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  align-items: start;
}

/* Левая колонка */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card-compact {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.user-main-info h2 {
  color: #2d3748;
  margin: 0 0 5px 0;
  font-size: 18px;
}

.user-email {
  color: #718096;
  margin: 0 0 20px 0;
  font-size: 14px;
}

.user-additional-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #718096;
  font-size: 14px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.manager {
  background: #bee3f8;
  color: #2c5282;
}

.role-badge.engineer {
  background: #c6f6d5;
  color: #276749;
}

.role-badge.observer {
  background: #faf089;
  color: #744210;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #c6f6d5;
  color: #276749;
}

.status-badge:not(.active) {
  background: #fed7d7;
  color: #c53030;
}

.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.quick-actions h3 {
  color: #2d3748;
  margin-bottom: 20px;
  font-size: 18px;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.action-button {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #4a5568;
  text-align: center;
  font-size: 14px;
}

.action-button:hover {
  background: #4299e1;
  border-color: #4299e1;
  color: white;
  transform: translateY(-2px);
}

/* Правая колонка - функции */
.functions-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.functions-card h3 {
  color: #2d3748;
  margin-bottom: 20px;
  font-size: 18px;
}

.functions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.function-item {
  padding: 15px;
  background: #f7fafc;
  border-radius: 8px;
  transition: transform 0.2s ease;
  border-left: 4px solid #4299e1;
}

.function-item:hover {
  transform: translateX(5px);
  background: #edf2f7;
}

.function-content h4 {
  color: #2d3748;
  margin: 0 0 5px 0;
  font-size: 16px;
}

.function-content p {
  color: #718096;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .user-mini {
    flex-direction: column;
    gap: 8px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>