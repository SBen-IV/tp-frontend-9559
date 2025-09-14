import { ref } from "vue";

async function useFetch(url: string, init: RequestInit) {
  const data = ref(null);
  const error = ref(null);

  fetch(url, init)
    .then((res: Response) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err));

  return { data, error };
}

export async function useGet(url: string) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return useFetch(url, init);
}
