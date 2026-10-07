// Envuelve un control de formulario con su etiqueta y un icono a la izquierda.
export default function CampoFormulario({ label, requerido, icon, trailing, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
        {requerido && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {children}
        {trailing && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
