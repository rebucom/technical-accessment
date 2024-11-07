export function generatePayload() {
    return {
      user_id: Math.floor(Math.random() * 1000),
      data: { value: Math.random() },
    };
}