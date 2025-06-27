
const BookingErrorState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Negocio no encontrado</h1>
        <p className="text-slate-600">La URL de reserva no es válida o el negocio no existe.</p>
      </div>
    </div>
  );
};

export default BookingErrorState;
