import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { SEVERITIES, SEVERITY_STYLE } from '../data/rules'

export default function ScoreCard({ report }) {
  const chartData = SEVERITIES.map((s) => ({ name: s, value: report.counts[s] })).filter((d) => d.value > 0)
  const gradeColor = ['A', 'B'].includes(report.grade) ? '#198754' : SEVERITY_STYLE.critical.color

  return (
    <div className="card card-body">
      <div className="row align-items-center text-center">
        <div className="col-md-4">
          <div className="score-grade" style={{ color: gradeColor }}>{report.grade}</div>
          <div className="text-secondary">Security score: {report.score}/100</div>
        </div>
        <div className="col-md-4 d-flex justify-content-center">
          {chartData.length ? (
            <PieChart width={180} height={180}>
              <Pie data={chartData} dataKey="value" innerRadius={45} outerRadius={80}>
                {chartData.map((d) => <Cell key={d.name} fill={SEVERITY_STYLE[d.name].color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : <p className="text-success m-0">No issues found</p>}
        </div>
        <div className="col-md-4 text-start">
          {SEVERITIES.map((s) => (
            <div key={s} className="d-flex justify-content-between mb-1">
              <span className={`badge text-bg-${SEVERITY_STYLE[s].badge}`}>{s}</span>
              <strong>{report.counts[s]}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}