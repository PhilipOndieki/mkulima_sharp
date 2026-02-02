import { HiCheck, HiClock, HiTruck, HiCheckCircle, HiXCircle } from 'react-icons/hi';

/**
 * OrderTimeline Component
 * 
 * Phase 3: Visual order status timeline
 * Shows the progression of the order through different statuses
 */
const OrderTimeline = ({ order }) => {
  /**
   * Define the timeline steps
   */
  const timelineSteps = [
    {
      status: 'pending_confirmation',
      label: 'Order Placed',
      description: 'Your order has been received',
      icon: HiClock
    },
    {
      status: 'confirmed',
      label: 'Confirmed',
      description: 'Your order has been confirmed',
      icon: HiCheck
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'Your order is being prepared',
      icon: HiClock
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
      description: 'Your order is on the way',
      icon: HiTruck
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Your order has been delivered',
      icon: HiCheckCircle
    }
  ];

  /**
   * Get the current step index based on order status
   */
  const getCurrentStepIndex = () => {
    if (order.status === 'cancelled') return -1;
    
    const statusOrder = ['pending_confirmation', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
    return statusOrder.indexOf(order.status);
  };

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = order.status === 'cancelled';

  /**
   * Check if a step is completed
   */
  const isStepCompleted = (index) => {
    return index <= currentStepIndex;
  };

  /**
   * Check if a step is current
   */
  const isStepCurrent = (index) => {
    return index === currentStepIndex;
  };

  /**
   * Format timestamp
   */
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = timestamp.toDate();
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get timestamp for a status
   */
  const getStepTimestamp = (status) => {
    const history = order.statusHistory?.find(h => h.status === status);
    return history ? formatTimestamp(history.timestamp) : null;
  };

  // If order is cancelled, show cancelled state
  if (isCancelled) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <HiXCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-900 mb-1">Order Cancelled</h3>
            <p className="text-red-700 mb-2">
              This order was cancelled on {formatTimestamp(order.cancelledAt)}
            </p>
            {order.statusHistory?.find(h => h.status === 'cancelled')?.note && (
              <p className="text-sm text-gray-600 italic">
                Reason: {order.statusHistory.find(h => h.status === 'cancelled').note}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>

      {/* Timeline */}
      <div className="relative">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const completed = isStepCompleted(index);
          const current = isStepCurrent(index);
          const timestamp = getStepTimestamp(step.status);

          return (
            <div key={step.status} className="relative pb-8 last:pb-0">
              {/* Connector Line */}
              {index < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-8 top-12 h-full w-0.5 ${
                    completed ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  style={{ zIndex: 0 }}
                ></div>
              )}

              {/* Step Content */}
              <div className="relative flex items-start gap-4" style={{ zIndex: 1 }}>
                {/* Icon Circle */}
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    current
                      ? 'bg-primary-600 ring-4 ring-primary-100'
                      : completed
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      completed ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>

                {/* Step Details */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold ${
                        current
                          ? 'text-primary-600 text-lg'
                          : completed
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </h3>
                    {timestamp && (
                      <span className="text-sm text-gray-600">{timestamp}</span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      current
                        ? 'text-gray-700 font-medium'
                        : completed
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Show note if available */}
                  {completed && order.statusHistory && (
                    <>
                      {order.statusHistory
                        .filter(h => h.status === step.status && h.note)
                        .map((history, idx) => (
                          <p key={idx} className="text-sm text-gray-500 mt-1 italic">
                            {history.note}
                          </p>
                        ))}
                    </>
                  )}

                  {/* Current Step Indicator */}
                  {current && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                      Current Status
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated Delivery (if not delivered) */}
      {order.status !== 'delivered' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 text-gray-700">
            <HiClock className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress?.county === 'Nairobi' ||
                order.deliveryAddress?.county === 'Kiambu' ||
                order.deliveryAddress?.county === 'Kajiado' ||
                order.deliveryAddress?.county === 'Machakos'
                  ? '2-3 business days'
                  : '3-5 business days'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Confirmation (if delivered) */}
      {order.status === 'delivered' && order.deliveredAt && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Order Delivered!</p>
                <p className="text-sm text-green-700">
                  Delivered on {formatTimestamp(order.deliveredAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;