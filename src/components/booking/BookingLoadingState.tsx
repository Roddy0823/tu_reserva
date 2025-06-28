
const BookingLoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center space-y-4 max-w-sm mx-auto">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 font-medium text-lg">Cargando información...</p>
        <p className="text-slate-500 text-sm">Preparando tu experiencia de reserva</p>
      </div>
    </div>
  );
};

export default BookingLoadingState;
