import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { formatDateTime } from '../utils/helpers';

export default function CustomerListPage({ api }) {
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return api.customers;
    return api.customers.filter((c) => [c.name, c.country, c.contact, c.industry].some((f) => (f || '').toLowerCase().includes(q)));
  }, [keyword, api.customers]);

  return (
    <section>
      <div className="page-header">
        <h2>客户列表</h2>
        <button className="btn primary" onClick={() => { setEditing(null); setShowForm(true); }}>新增客户</button>
      </div>
      <input className="search" placeholder="搜索：客户名称 / 国家 / 联系人 / 行业" value={keyword} onChange={(e) => setKeyword(e.target.value)} />

      {showForm && (
        <div className="card">
          <h3>{editing ? '编辑客户' : '新增客户'}</h3>
          <CustomerForm
            initialValue={editing}
            onSubmit={(payload) => {
              if (editing) api.updateCustomer(editing.id, payload); else api.addCustomer(payload);
              setShowForm(false);
              setEditing(null);
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>客户名称</th><th>国家</th><th>联系人</th><th>行业</th><th>更新时间</th><th>操作</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="6" className="empty">暂无客户数据</td></tr>
            ) : rows.map((c) => (
              <tr key={c.id}>
                <td><Link to={`/customers/${c.id}`}>{c.name}</Link></td>
                <td>{c.country || '-'}</td>
                <td>{c.contact || '-'}</td>
                <td>{c.industry || '-'}</td>
                <td>{formatDateTime(c.updatedAt)}</td>
                <td>
                  <button className="btn small" onClick={() => { setEditing(c); setShowForm(true); }}>编辑</button>
                  <button className="btn small danger" onClick={() => {
                    if (window.confirm('删除客户会同时删除关联项目，确认吗？')) api.deleteCustomer(c.id);
                  }}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
