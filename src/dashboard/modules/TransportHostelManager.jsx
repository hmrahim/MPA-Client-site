import { useState } from 'react'
import {
  Bus,
  Bed,
  MapPin,
  CheckCircle2
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function TransportHostelManager() {
  const { transportRoutes, hostelRooms } = useDashboard()
  const [activeTab, setActiveTab] = useState('transport')

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 moom-card p-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-1">
            <Bus className="w-3.5 h-3.5" />
            <span>Campus Logistics & Infrastructure</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Transport & Residence Halls
          </h2>
          <p className="text-xs text-slate-400">
            Fleet management, vehicle routes, GPS tracking, and hostel room occupancy
          </p>
        </div>

        <div className="flex bg-[#16161f] p-1 rounded-xl border border-[#1e1e2e]">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'transport' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bus Routes ({transportRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('hostel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'hostel' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Residence Halls ({hostelRooms.length})
          </button>
        </div>
      </div>

      {activeTab === 'transport' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transportRoutes.map((rt) => (
            <div
              key={rt.id}
              className="moom-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black font-mono">
                    {rt.id}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    {rt.vehicleNo}
                  </span>
                </div>

                <h3 className="font-black text-base text-white mb-2">{rt.name}</h3>

                <div className="space-y-2 text-xs text-slate-300 bg-[#16161f] p-4 rounded-xl border border-[#1e1e2e]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Designated Driver:</span>
                    <span className="font-bold text-white">{rt.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Driver Contact:</span>
                    <span className="font-mono text-[#a78bfa]">{rt.driverPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Seat Capacity:</span>
                    <span className="font-bold text-white">{rt.enrolledStudents} / {rt.capacity} Students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monthly Fare:</span>
                    <span className="font-mono font-bold text-emerald-400">৳{rt.fare} / month</span>
                  </div>
                </div>

                {/* Stops */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">Pickup & Drop Stoppages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rt.stops.map((stop, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium"
                      >
                        <MapPin className="w-3 h-3 text-[#a78bfa]" />
                        <span>{stop}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1e1e2e] flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GPS Tracking Active</span>
                </span>
                <span className="text-slate-500 text-[11px]">Timings: 07:30 AM & 04:00 PM</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Residence Halls Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {hostelRooms.map((rm) => (
            <div
              key={rm.id}
              className="moom-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#a78bfa] border border-[#6c63ff]/20 text-[11px] font-bold font-mono">
                    Room {rm.roomNo}
                  </span>
                  <Bed className="w-4 h-4 text-[#a78bfa]" />
                </div>

                <h3 className="font-bold text-sm text-white mb-1">{rm.building}</h3>
                <p className="text-xs text-slate-400 mb-3">Hall Tutor: {rm.tutor}</p>

                <div className="bg-[#16161f] p-3 rounded-xl border border-[#1e1e2e] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Beds:</span>
                    <span className="font-bold text-white font-mono">{rm.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupied:</span>
                    <span className="font-bold text-[#a78bfa] font-mono">{rm.occupied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Available:</span>
                    <span className="font-bold text-emerald-400 font-mono">{rm.capacity - rm.occupied}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  rm.capacity === rm.occupied
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {rm.capacity === rm.occupied ? 'Fully Occupied' : 'Beds Available'}
                </span>
                <button className="text-[#a78bfa] hover:underline font-bold text-xs">Assign Bed &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
