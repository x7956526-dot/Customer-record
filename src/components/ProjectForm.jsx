import { useState } from 'react';
import { PROJECT_STAGES } from '../constants/stages';

const empty = {
  name: '',
  customerId: '',
  model: '',
  applicationDesc: '',
  stage: '新机会',
  sampleStatus: '',
  drawingVersion: '',
  testStatus: '',
  deliveryStatus: '',
  risks: '',
  nextAction: '',
  owner: '',
  needFollowUp: false,
};

export default function ProjectForm({ initialValue, customers, lockCustomerId, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...empty, ...initialValue, customerId: lockCustomerId || initialValue?.customerId || '' });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('项目名称不能为空');
    if (!form.customerId) return alert('请选择所属客户');
    onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>项目名称<input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required /></label>
      <label>所属客户
        <select value={form.customerId} onChange={(e) => handleChange('customerId', e.target.value)} disabled={Boolean(lockCustomerId)}>
          <option value="">请选择</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label>产品型号<input value={form.model} onChange={(e) => handleChange('model', e.target.value)} /></label>
      <label>应用描述<input value={form.applicationDesc} onChange={(e) => handleChange('applicationDesc', e.target.value)} /></label>
      <label>当前阶段
        <select value={form.stage} onChange={(e) => handleChange('stage', e.target.value)}>
          {PROJECT_STAGES.map((stage) => <option key={stage}>{stage}</option>)}
        </select>
      </label>
      <label>样品状态<input value={form.sampleStatus} onChange={(e) => handleChange('sampleStatus', e.target.value)} /></label>
      <label>图纸版本<input value={form.drawingVersion} onChange={(e) => handleChange('drawingVersion', e.target.value)} /></label>
      <label>测试状态<input value={form.testStatus} onChange={(e) => handleChange('testStatus', e.target.value)} /></label>
      <label>交期状态<input value={form.deliveryStatus} onChange={(e) => handleChange('deliveryStatus', e.target.value)} /></label>
      <label>风险点<textarea value={form.risks} onChange={(e) => handleChange('risks', e.target.value)} /></label>
      <label>下一步动作<textarea value={form.nextAction} onChange={(e) => handleChange('nextAction', e.target.value)} /></label>
      <label>负责人<input value={form.owner} onChange={(e) => handleChange('owner', e.target.value)} /></label>
      <label className="checkbox-label"><input type="checkbox" checked={form.needFollowUp} onChange={(e) => handleChange('needFollowUp', e.target.checked)} />手动标记“需要跟进”</label>
      <div className="actions-row">
        <button type="submit" className="btn primary">保存</button>
        <button type="button" className="btn" onClick={onCancel}>取消</button>
      </div>
    </form>
  );
}
