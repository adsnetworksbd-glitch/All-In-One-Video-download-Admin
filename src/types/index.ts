export interface AdminUser {
  uid: string;
  email: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  adapter_type: 'builtin' | 'http_api';
  is_enabled: boolean;
  supported_platforms: string[];
  config: {
    endpoint_url?: string;
    http_method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    timeout_seconds: number;
    response_mapping?: { direct_url_path: string; title_path?: string };
  };
  last_health_check?: { status: 'healthy' | 'degraded' | 'down'; message?: string };
}

export interface TelegramUser {
  telegram_id: number;
  first_name: string;
  username?: string | null;
  credit_balance: number;
  is_banned: boolean;
  referred_by?: number | null;
  created_at: number;
}

export interface DownloadJob {
  job_id: string;
  telegram_user_id: number;
  category_slug: string;
  sanitized_url: string;
  selected_quality?: string;
  credit_cost: number;
  status: string;
  result?: { title?: string; download_url?: string };
  error?: { code: string; message: string };
  created_at: number;
}