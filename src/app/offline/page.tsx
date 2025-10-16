import { Fragment } from "react";

export default function OfflinePage() {
  return (
    <Fragment>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <h1 className="text-3xl font-bold text-gray-900">Estás sin conexión</h1>
        <p className="mt-3 text-gray-700 max-w-md">
          No pudimos conectarnos a internet. Puedes seguir navegando contenido ya
          visitado. Cuando recuperes conexión, actualizaremos la información automáticamente.
        </p>
      </div>
    </Fragment>
  );
}


