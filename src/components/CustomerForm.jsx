import { useState } from 'react';

const empty = {
  name: '',
  country: '',
  contact: '',
  email: '',
  phone: '',
  industry: '',
  application: '',
  products: '',
  requirements: '',
  notes: '',
};

export default function CustomerForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValue || empty);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('客户名称不能为空');
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>客户名称<input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required /></label>
      <label>国家/地区<input value={form.country} onChange={(e) => handleChange('country', e.target.value)} /></label>
      <label>联系人<input value={form.contact} onChange={(e) => handleChange('contact', e.target.value)} /></label>
      <label>邮箱<input value={form.email} onChange={(e) => handleChange('email', e.target.value)} /></label>
      <label>电话<input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} /></label>
      <label>行业<input value={form.industry} onChange={(e) => handleChange('industry', e.target.value)} /></label>
      <label>主要应用<input value={form.application} onChange={(e) => handleChange('application', e.target.value)} /></label>
      <label>常用产品/型号<input value={form.products} onChange={(e) => handleChange('products', e.target.value)} /></label>
      <label>特殊要求<textarea value={form.requirements} onChange={(e) => handleChange('requirements', e.target.value)} /></label>
      <label>备注<textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} /></label>
      <div className="actions-row">
        <button type="submit" className="btn primary">保存</button>
        <button type="button" className="btn" onClick={onCancel}>取消</button>
      </div>
    </form>
  );
}
