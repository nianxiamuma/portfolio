/**
 * jsdom 环境补齐：浏览器专有 API 的最小替身。
 * 只补齐测试所需的行为，不做真实实现。
 */

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

globalThis.ResizeObserver = globalThis.ResizeObserver || NoopObserver
globalThis.IntersectionObserver = globalThis.IntersectionObserver || NoopObserver

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  })
}

// jsdom 无 canvas 实现；组件在拿不到 context 时会安全退出
HTMLCanvasElement.prototype.getContext = () => null
