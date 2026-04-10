import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { formatDate, formatDateTime } from '../utils/helpers';

export default function ProjectDetailPage({ api }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = api.projects.find((p) => p.id === id);
  const [editing, setEditing] = useState(false);
  const [record, setRecord] = useState({ date: formatDate(new Date().toISOString()), content: '' });

  const customer = useMemo(() => api.customers.find((c) => c.id === project?.customerId), [api.customers, project]);

  if (!project) return <div className="card">项目不存在。<button className="btn" onClick={() => navigate('/projects')}>返回</button></div>;

  const followUps = [...(project.followUps || [])].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  return (
    <section>
      <div className="page-header">
        <h2>{project.name}</h2>
        <div>
          <button className="btn" onClick={() => navigate('/projects')}>返回项目列表</button>
          <button className="btn primary" onClick={() => setEditing((v) => !v)}>{editing ? '取消编辑' : '编辑项目'}</button>
        </div>
      </div>

      {editing ? (
        <div className="card">
          <ProjectForm
            initialValue={project}
            customers={api.customers}
            onSubmit={(payload) => { api.updateProject(project.id, payload); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="card info-grid">
          <div><strong>所属客户：</strong>{customer?.name || '-'}</div>
          <div><strong>产品型号：</strong>{project.model || '-'}</div>
          <div><strong>应用描述：</strong>{project.applicationDesc || '-'}</div>
          <div><strong>当前阶段：</strong>{project.stage}</div>
          <div><strong>样品状态：</strong>{project.sampleStatus || '-'}</div>
          <div><strong>图纸版本：</strong>{project.drawingVersion || '-'}</div>
          <div><strong>测试状态：</strong>{project.testStatus || '-'}</div>
          <div><strong>交期状态：</strong>{project.deliveryStatus || '-'}</div>
          <div><strong>风险点：</strong>{project.risks || '-'}</div>
          <div><strong>下一步动作：</strong>{project.nextAction || '-'}</div>
          <div><strong>负责人：</strong>{project.owner || '-'}</div>
          <div><strong>创建时间：</strong>{formatDateTime(project.createdAt)}</div>
          <div><strong>更新时间：</strong>{formatDateTime(project.updatedAt)}</div>
        </div>
      )}

      <div className="card">
        <h3>项目跟进记录</h3>
        <form
          className="followup-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!record.content.trim()) return alert('请填写跟进内容');
            api.addFollowUp(project.id, record);
            setRecord({ date: formatDate(new Date().toISOString()), content: '' });
          }}
        >
          <input type="date" value={record.date} onChange={(e) => setRecord((p) => ({ ...p, date: e.target.value }))} />
          <input placeholder="跟进内容" value={record.content} onChange={(e) => setRecord((p) => ({ ...p, content: e.target.value }))} />
          <button className="btn primary" type="submit">新增记录</button>
        </form>
        <ul className="followup-list">
          {followUps.length === 0 ? <li className="empty">暂无跟进记录</li> : followUps.map((f) => (
            <li key={f.id}>
              <div><strong>{f.date || formatDate(f.createdAt)}</strong>：{f.content}</div>
              <button className="btn small danger" onClick={() => { if (window.confirm('确认删除该记录？')) api.deleteFollowUp(project.id, f.id); }}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
