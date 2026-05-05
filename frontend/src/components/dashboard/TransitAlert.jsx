import { useEffect, useState } from 'react';
import { AlertTriangle, Bell, BellOff, CheckCircle, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import useTransitStore from '../../store/useTransitStore';
import useAstroStore from '../../store/useAstroStore';

const IMPACT_COLORS = {
  high:     { badge: 'bg-red-100 text-red-700',     icon: 'text-red-600',    ring: 'border-red-300/40' },
  medium:   { badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-600',  ring: 'border-amber-300/40' },
  low:      { badge: 'bg-blue-100 text-blue-700',   icon: 'text-blue-600',   ring: 'border-blue-300/40' },
  positive: { badge: 'bg-green-100 text-green-700', icon: 'text-green-600',  ring: 'border-green-300/40' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const SingleTransit = ({ transit, primaryProfileId }) => {
  const { isSubscribing, subscribeToAlert, unsubscribeFromAlert, isSubscribedTo, getAlertIdFor } = useTransitStore();
  const [expanded, setExpanded] = useState(false);
  const subscribed = isSubscribedTo(transit._id);
  const alertId = getAlertIdFor(transit._id);
  const colors = IMPACT_COLORS[transit.impact_level] || IMPACT_COLORS.medium;

  const handleToggleSubscription = async () => {
    if (!primaryProfileId) return;
    if (subscribed && alertId) {
      await unsubscribeFromAlert(alertId);
    } else {
      await subscribeToAlert(transit._id, primaryProfileId, 'push');
    }
  };

  return (
    <div className={`w-full bg-[#E5CAA0] border ${colors.ring} border-[#CFA876] shadow-md rounded-2xl p-4 relative overflow-hidden transition-all duration-300`}>
      {/* Decorative swirl overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'repeating-radial-gradient(circle at center, transparent 0, transparent 15px, #fff 15px, #fff 16px)',
        backgroundSize: '100px 100px'
      }}></div>

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full bg-white/40 flex items-center justify-center flex-shrink-0 ${colors.icon} shadow-inner border border-white/50`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[#4A3319] text-[clamp(0.8rem,1.2vw,1rem)]">{transit.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${colors.badge}`}>
                  {transit.impact_level} Impact
                </span>
                {subscribed && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Subscribed
                  </span>
                )}
              </div>
              <p className="text-astra-brown/70 text-[clamp(0.65rem,0.9vw,0.8rem)] mt-0.5">
                Starts {formatDate(transit.starts_at)} · {transit.planet} {transit.event_type}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#8B6E4A]"
              title={expanded ? 'Collapse' : 'Read Impact'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {primaryProfileId && (
              <button
                onClick={handleToggleSubscription}
                disabled={isSubscribing}
                title={subscribed ? 'Unsubscribe from alert' : 'Get notified for this transit'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  subscribed
                    ? 'bg-green-50 text-green-700 border-green-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                    : 'bg-[#4A3319] text-[#FFF5E1] border-transparent hover:bg-[#6B4C2A]'
                }`}
              >
                {isSubscribing
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : subscribed
                    ? <BellOff className="w-3 h-3" />
                    : <Bell className="w-3 h-3" />
                }
                {subscribed ? 'Subscribed' : 'Alert Me'}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Description */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#CFA876]/40 text-[#5c3a1d] text-sm leading-relaxed animate-fadeIn">
            <p>{transit.description}</p>
            {transit.affects_sign?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-xs font-bold text-[#4A3319] uppercase tracking-wide mr-1">Most Affected:</span>
                {transit.affects_sign.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-[#C4A15A]/20 text-[#4A3319] text-xs capitalize font-medium border border-[#C4A15A]/30">{s}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TransitAlert = () => {
  const { transits, isLoading, error, fetchTransits, fetchUserAlerts } = useTransitStore();
  const profiles = useAstroStore(state => state.profiles);

  // Get the primary profile's ID to use for subscriptions
  const primaryProfile = Array.isArray(profiles) 
    ? (profiles.find(p => p.is_primary) || profiles[0])
    : null;
  const primaryProfileId = primaryProfile?._id;

  useEffect(() => {
    fetchTransits();
    fetchUserAlerts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-[#E5CAA0] border border-[#CFA876] rounded-2xl p-6 flex items-center justify-center gap-3 text-[#8B6E4A]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-medium text-sm">Scanning the heavens for transits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">
        Could not load transits: {error}
      </div>
    );
  }

  const upcomingTransits = (transits || [])
    .filter(t => new Date(t.starts_at) >= new Date().setHours(0,0,0,0))
    .slice(0, 9);

  if (upcomingTransits.length === 0) {
    return (
      <div className="w-full bg-[#E5CAA0] border border-[#CFA876] rounded-2xl p-6 flex items-center gap-4 text-[#8B6E4A]">
        <Sparkles className="w-6 h-6 flex-shrink-0" />
        <div>
          <p className="font-bold text-[#4A3319] text-sm">All is quiet in the cosmos</p>
          <p className="text-xs mt-0.5">No upcoming major transits found for the near future.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {upcomingTransits.map(transit => (
        <SingleTransit
          key={transit._id}
          transit={transit}
          primaryProfileId={primaryProfileId}
        />
      ))}
    </div>
  );
};

export default TransitAlert;
