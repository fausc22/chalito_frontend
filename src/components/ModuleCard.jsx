export function ModuleCard({ title, description, icon, onClick}) {
    return (
        <div className="module-card" onClick={onClick}>
            <div className="module-icon">
                {icon}
            </div>
            <div className="module-content">
                <h3 className="module-title">{title}</h3>
                <p className="module-description">{description}</p>
            </div>
        </div>
    )
}