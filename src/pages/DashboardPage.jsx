import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PROJECT_STAGES, STAGE_COLORS } from '../constants/stages';
import { exportJson, importJsonFile } from '../utils/storage';
import { formatDateTime } from '../utils/helpers';

export default function DashboardPage({ api }) {
  const fileRef = useRef(null);

  const stats = useMemo(() => {
    const map = Object.fromEntries(PROJECT_STAGES.map((s) => [s, 0]));
    api.projects.forEach((p) => {
      map[p.stage] = (map[p.stage] || 0) + 1;
    });
    return map;
  }, [api.projects]);

  const recentProjects = useMemo(
    () => [...api.projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5),
    [api.projects],
  );

  const needFollowUp = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return api.projects.filter((p) => p.needFollowUp || (p.stage !== '关闭' && p.stage !== '暂停' && now - new Date(p.updatedAt).getTime() > sevenDays));
  }, [api.projects]);

  return (
    <section>
      <div className="page-header"><h2>首页看板</h2></div>
      <div className="kpis">
        <div className="kpi"><span>客户总数</span><strong>{api.customers.length}</strong></div>
        <div className="kpi"><span>项目总数</span><strong>{api.projects.length}</strong></div>
        <div className="kpi"><span>进行中项目</span><strong>{(stats.评估中 || 0) + (stats.打样中 || 0) + (stats.测试中 || 0) + (stats.小批量 || 0)}</strong></div>
        <div className="kpi"><span>测试中项目</span><strong>{stats.测试中 || 0}</strong></div>
        <div className="kpi"><span>暂停项目</span><strong>{stats.暂停 || 0}</strong></div>
      </div>

      <div className="card">
        <h3>项目阶段统计</h3>
        <div className="tags-wrap">
          {PROJECT_STAGES.map((stage) => <span key={stage} className={`tag ${STAGE_COLORS[stage]}`}>{stage}：{stats[stage] || 0}</span>)}
        </div>
      </div>

      <div className="card">
        <h3>最近更新项目（5条）</h3>
        <ul>
          {recentProjects.length === 0 ? <li className="empty">暂无项目数据</li> : recentProjects.map((p) => (
            <li key={p.id}><Link to={`/projects/${p.id}`}>{p.name}</Link> · {formatDateTime(p.updatedAt)}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>需要跟进的项目</h3>
        <ul>
          {needFollowUp.length === 0 ? <li className="empty">暂无需要跟进项目</li> : needFollowUp.map((p) => (
            <li key={p.id}><Link to={`/projects/${p.id}`}>{p.name}</Link> · 最后更新 {formatDateTime(p.updatedAt)}</li>
          ))}
        </ul>
      </div>

      <div className="card actions-row">
        <button className="btn" onClick={() => exportJson({ customers: api.customers, projects: api.projects })}>导出 JSON</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>导入 JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const data = await importJsonFile(file);
              api.replaceAll(data);
              alert('导入成功');
            } catch (error) {
              alert(error.message || '导入失败');
            }
          }}
        />
      </div>
    </section>
  );
}
