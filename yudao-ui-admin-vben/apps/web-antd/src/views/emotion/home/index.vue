<template>
  <div class="emotion-home-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-hearts">
        <HeartIcon v-for="i in 6" :key="i" class="floating-heart" :style="getHeartStyle(i)" />
      </div>
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- Logo 和标题 -->
      <div class="logo-section">
        <div class="logo-container">
          <div class="cat-avatar">
            <HeartIcon class="cat-icon" />
          </div>
        </div>
        <h1 class="main-title">白小猫AI情感咨询</h1>
        <p class="main-subtitle">你的专属情感陪伴，随时倾听你的心声</p>
      </div>

      <!-- 主要操作按钮 -->
      <div class="action-section">
        <Button type="primary" size="large" class="start-chat-btn" @click="startChat">
          <HeartIcon class="btn-icon" />
          开始撸猫
        </Button>
        <p class="action-hint">点击开始，与AI小猫进行情感对话</p>
      </div>

      <!-- 简单的功能介绍 -->
      <div class="features-preview">
        <div class="feature-item">
          <ClockIcon class="feature-icon" />
          <span>24小时在线</span>
        </div>
        <div class="feature-item">
          <LockIcon class="feature-icon" />
          <span>隐私保护</span>
        </div>
        <div class="feature-item">
          <SparklesIcon class="feature-icon" />
          <span>AI智能</span>
        </div>
        <div class="feature-item">
          <HeadphonesIcon class="feature-icon" />
          <span>专业倾听</span>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer-info">
      <p class="privacy-notice">
        <ShieldIcon class="shield-icon" />
        我们承诺保护您的隐私，所有对话内容都经过加密处理
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { Button } from 'ant-design-vue';
import { createIconifyIcon } from '@vben/icons';

// 创建图标组件
const HeartIcon = createIconifyIcon('lucide:heart');
const ClockIcon = createIconifyIcon('lucide:clock');
const LockIcon = createIconifyIcon('lucide:lock');
const SparklesIcon = createIconifyIcon('lucide:sparkles');
const HeadphonesIcon = createIconifyIcon('lucide:headphones');
const ShieldIcon = createIconifyIcon('lucide:shield');

const router = useRouter();

// 开始聊天
function startChat() {
  router.push('/emotion/chat');
}

// 生成浮动爱心的样式
function getHeartStyle(index: number) {
  const positions = [
    { left: '10%', animationDelay: '0s', animationDuration: '6s' },
    { left: '20%', animationDelay: '1s', animationDuration: '8s' },
    { left: '80%', animationDelay: '2s', animationDuration: '7s' },
    { left: '90%', animationDelay: '3s', animationDuration: '9s' },
    { left: '15%', animationDelay: '4s', animationDuration: '6s' },
    { left: '85%', animationDelay: '5s', animationDuration: '8s' },
  ];

  return positions[index - 1] || positions[0];
}
</script>

<style lang="scss" scoped>
.emotion-home-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

// 背景装饰
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .floating-hearts {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .floating-heart {
      position: absolute;
      width: 20px;
      height: 20px;
      color: rgba(255, 255, 255, 0.1);
      animation: float-up linear infinite;
    }
  }

  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;

    &.orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #ff6b9d, transparent);
      top: 10%;
      left: 10%;
      animation: float 8s ease-in-out infinite;
    }

    &.orb-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, #4ecdc4, transparent);
      top: 60%;
      right: 10%;
      animation: float 6s ease-in-out infinite reverse;
    }

    &.orb-3 {
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, #45b7d1, transparent);
      bottom: 20%;
      left: 20%;
      animation: float 10s ease-in-out infinite;
    }
  }
}

@keyframes float-up {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 主要内容区域
.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
}

// Logo 和标题区域
.logo-section {
  margin-bottom: 60px;

  .logo-container {
    margin-bottom: 32px;

    .cat-avatar {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.2);
      animation: gentle-pulse 3s ease-in-out infinite;

      .cat-icon {
        width: 80px;
        height: 80px;
        color: white;
      }
    }
  }

  .main-title {
    font-size: 42px;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .main-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin: 0;
  }
}

@keyframes gentle-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  }
}

// 操作按钮区域
.action-section {
  margin-bottom: 60px;

  .start-chat-btn {
    height: 64px;
    padding: 0 48px;
    font-size: 20px;
    font-weight: 600;
    border-radius: 32px;
    background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%);
    border: none;
    color: white;
    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;

    .btn-icon {
      width: 24px;
      height: 24px;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(255, 107, 157, 0.5);
      background: linear-gradient(135deg, #ff5a8a 0%, #3bb8b0 100%);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  .action-hint {
    margin-top: 16px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
}

// 功能预览
.features-preview {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: 40px;

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;

    .feature-icon {
      width: 32px;
      height: 32px;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

// 底部信息
.footer-info {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;

  .privacy-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;

    .shield-icon {
      width: 16px;
      height: 16px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }

  .logo-section {
    margin-bottom: 40px;

    .logo-container .cat-avatar {
      width: 100px;
      height: 100px;

      .cat-icon {
        width: 70px;
        height: 70px;
      }
    }

    .main-title {
      font-size: 32px;
    }

    .main-subtitle {
      font-size: 16px;
    }
  }

  .action-section {
    margin-bottom: 40px;

    .start-chat-btn {
      height: 56px;
      padding: 0 32px;
      font-size: 18px;
    }
  }

  .features-preview {
    gap: 24px;

    .feature-item {
      font-size: 12px;

      .feature-icon {
        width: 28px;
        height: 28px;
      }
    }
  }
}

@media (max-width: 480px) {
  .features-preview {
    gap: 16px;

    .feature-item {
      font-size: 11px;

      .feature-icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
