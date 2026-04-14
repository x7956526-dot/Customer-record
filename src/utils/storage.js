const STORAGE_KEY = 'crm_local_app_v1';

export const defaultData = {
  customers: [],
  projects: [],
};

export const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return {
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    };
  } catch (error) {
    return defaultData;
  }
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportJson = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crm-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJsonFile = async (file) => {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.customers) || !Array.isArray(parsed.projects)) {
    throw new Error('JSON 格式无效，必须包含 customers 和 projects 数组');
  }
  return {
    customers: parsed.customers,
    projects: parsed.projects,
  };
};
