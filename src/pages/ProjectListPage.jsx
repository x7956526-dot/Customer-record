import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { PROJECT_STAGES, STAGE_COLORS } from '../constants/stages';
import { formatDateTime } from '../utils/helpers';

export default function ProjectListPage({ api }) {
  const [keyword, setKeyword] = useState('');
  const [stage, setStage] = useState('全部');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const customerMap = useMemo(() => Object.fromEntries(api.customers.map((c) => [c.id, c.name])), [api.customers]);
  const rows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return api.projects.filter((p) => {
      const passStage = stage === '全部' ? true : p.stage === stage;
      const passSearch = !q
        ? true
        : [p.name, customerMap[p.customerId], p.model, p.stage].some((f) => (f || '').toLowerCase().includes(q));
      return passStage && passSearch;
    });
  }, [api.projects, stage, keyword, customerMap]);

  return (
    <section>
      <div className="page-header">
        <h2>项目管理</h2>
        <button className="btn primary" onClick={() => { setEditing(null); setShowForm(true); }}>新增项目</button>
      </div>
      <div className="filters">
        <input className="search" placeholder="搜索：项目名/客户/型号/阶段" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <select value={stage} onChange={(e) => setStage(e.target.value)}>
          <option>全部</option>
          {PROJECT_STAGES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {showForm && (
        <div className="card">
          <h3>{editing ? '编辑项目' : '新增项目'}</h3>
          <ProjectForm
            initialValue={editing}
            customers={api.customers}
            onSubmit={(payload) => {
              if (editing) api.updateProject(editing.id, payload); else api.addProject(payload);
              setShowForm(false);
              setEditing(null);
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>项目</th><th>客户</th><th>型号</th><th>阶段</th><th>更新时间</th><th>操作</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan="6" className="empty">暂无项目</td></tr> : rows.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/projects/${p.id}`}>{p.name}</Link></td>
                <td>{customerMap[p.customerId] || '-'}</td>
                <td>{p.model || '-'}</td>
                <td><span className={`tag ${STAGE_COLORS[p.stage] || 'tag-blue'}`}>{p.stage}</span></td>
                <td>{formatDateTime(p.updatedAt)}</td>
                <td>
                  <button className="btn small" onClick={() => { setEditing(p); setShowForm(true); }}>编辑</button>
                  <button className="btn small danger" onClick={() => { if (window.confirm('确认删除该项目？')) api.deleteProject(p.id); }}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
