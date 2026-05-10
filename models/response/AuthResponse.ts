// Бэк при логине/регистрации НЕ возвращает user — только токены.
// Используй TokenResponse напрямую в сервисах.
// Этот файл оставлен для обратной совместимости, если где-то ещё используется AuthResponse.

export { TokenResponse as AuthResponse } from "./TokenResponse";