
import { TrendingDown, CreditCard, Shield, Calendar } from "lucide-react";

const PaymentFeaturesSection = () => {
  return (
    <section className="py-20 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-purple-600 mb-4">
            Cobra por adelantado y<br />
            elimina las inasistencias
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integración completa con <strong>MercadoPago</strong> y transferencias bancarias para<br />
            maximizar tus ingresos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduce pérdidas hasta en un 80%</h3>
                <p className="text-gray-600">
                  Los pagos anticipados disminuyen drasticamente las inasistencias y<br />
                  mejoran la gestión de tu agenda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Múltiples métodos de pago</h3>
                <p className="text-gray-600">
                  Acepta tarjetas de crédito/débito, transferencias bancarias y más a través<br />
                  de MercadoPago.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Transacciones 100% seguras</h3>
                <p className="text-gray-600">
                  Todas las operaciones están protegidas y cumplen con los más altos<br />
                  estándares de seguridad.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form Mockup */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completar pago</h3>
              <div className="text-sm text-gray-500">Reserva: Corte de cabello</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                  <div className="w-8 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">MP</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta</label>
                <input 
                  type="text" 
                  placeholder="•••• •••• •••• 4242"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de vencimiento</label>
                  <input 
                    type="text" 
                    placeholder="12/25"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input 
                    type="text" 
                    placeholder="•••"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    disabled
                  />
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-700">
                  <strong>Reducción de inasistencias</strong>
                </div>
                <div className="text-lg font-bold text-green-800">80%</div>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold">
                Pagar $2.500
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentFeaturesSection;
