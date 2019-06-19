export const requestToServer = (promise, onSuccess, onError) => {
  (async () => {
    try {
      const res = await promise;

      if (!res || !res.data) throw new Error('No response from server');
      const { isSuccess, message, data } = res.data;
      if (!isSuccess) throw new Error(message);

      onSuccess(data, message);
    } catch (err) {
      if (!err.response) onError(err.message);
      else {
        const { message } = err.response.data;
        onError(message);
      }
    }
  })();
};
