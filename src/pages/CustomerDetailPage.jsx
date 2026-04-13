import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { formatDateTime } from '../utils/helpers';
import { STAGE_COLORS } from '../constants/stages';

export default function CustomerDetailPage({ api }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const customer = api.customers.find((c) => c.id === id);
  const projects = useMemo(() => api.projects.filter((p) => p.customerId === id), [api.projects, id]);

  if (!customer) return <div className="card">客户不存在。<button className="btn" onClick={() => navigate('/customers')}>返回</button></div>;

  return (
    <section>
      <div className="page-header"><h2>{customer.name}</h2><button className="btn" onClick={() => navigate('/customers')}>返回客户列表</button></div>
      <div className="card">
        <h3>客户信息</h3>
        <div className="info-grid">
          <div><strong>国家：</strong>{customer.country || '-'}</div>
          <div><strong>联系人：</strong>{customer.contact || '-'}</div>
          <div><strong>邮箱：</strong>{customer.email || '-'}</div>
          <div><strong>电话：</strong>{customer.phone || '-'}</div>
          <div><strong>行业：</strong>{customer.industry || '-'}</div>
          <div><strong>主要应用：</strong>{customer.application || '-'}</div>
          <div><strong>常用产品：</strong>{customer.products || '-'}</div>
          <div><strong>特殊要求：</strong>{customer.requirements || '-'}</div>
          <div><strong>备注：</strong>{customer.notes || '-'}</div>
          <div><strong>创建时间：</strong>{formatDateTime(customer.createdAt)}</div>
          <div><strong>更新时间：</strong>{formatDateTime(customer.updatedAt)}</div>
          <div><strong>项目数量：</strong>{projects.length}</div>
        </div>
      </div>

      <div className="page-header"><h3>关联项目</h3><button className="btn primary" onClick={() => setShowProjectForm((v) => !v)}>新增项目</button></div>
      {showProjectForm && (
        <div className="card">
          <ProjectForm
            customers={api.customers}
            lockCustomerId={id}
            onSubmit={(payload) => { api.addProject(payload); setShowProjectForm(false); }}
            onCancel={() => setShowProjectForm(false)}
          />
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>项目名称</th><th>型号</th><th>阶段</th><th>更新时间</th></tr></thead>
          <tbody>
            {projects.length === 0 ? <tr><td colSpan="4" className="empty">暂无项目</td></tr> : projects.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/projects/${p.id}`}>{p.name}</Link></td>
                <td>{p.model || '-'}</td>
                <td><span className={`tag ${STAGE_COLORS[p.stage] || 'tag-blue'}`}>{p.stage}</span></td>
                <td>{formatDateTime(p.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
