import { ref, onMounted, onUnmounted } from 'vue';
export function useObserver() {
  const isIntersecting = ref(false);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isIntersecting.value = entry.isIntersecting;
    }),{ threshold: 0.1}
  })
  
  const observe = (element) => {
    if (element) {
      observer.observe(element);
    }
  }
  
  
  
  
  onUnmounted(() => {
    observer.disconnect();
  });
  
  return { isIntersecting, observe };
}

