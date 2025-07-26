import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Send,
  QrCode,
  History,
  CreditCard,
  Settings,
  BarChart3,
  Wallet,
  Menu,
  X,
  LogOut,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletContextProvider as WalletProvider } from "@/components/wallet/WalletContextProvider";
import { useWallet } from "@solana/wallet-adapter-react"; // ✅ Correct import

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Send Money", url: createPageUrl("Send"), icon: Send },
  { title: "QR Payments", url: createPageUrl("QRPayments"), icon: QrCode },
  { title: "History", url: createPageUrl("History"), icon: History },
  { title: "Pay Later", url: createPageUrl("PayLater"), icon: CreditCard },
  { title: "Profile", url: createPageUrl("Profile"), icon: Settings }
];

const adminItems = [
  { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 }
];

const AppLayout = ({ children, currentPageName }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [userRole] = React.useState("user");
  const { connected: isConnected, publicKey, connect, disconnect } = useWallet();

  const isCurrentPage = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #F59E0B 100%);
          --glass-bg: rgba(255, 255, 255, 0.8);
          --glass-border: rgba(255, 255, 255, 0.2);
        }

        .glass-morphism {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
        }

        .gradient-text {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .premium-shadow {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden glass-morphism sticky top-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
      
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-white/50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 glass-morphism border-t mt-0 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isCurrentPage(item.url)
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
            {userRole === "admin" && adminItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isCurrentPage(item.url)
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
                <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-800">Admin</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="glass-morphism m-4 rounded-2xl premium-shadow flex-1 flex flex-col">
            <div className="p-6 border-b border-white/20">
              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
            
              </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isCurrentPage(item.url)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-white/50 text-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}

              {userRole === "admin" && (
                <div className="pt-4 mt-4 border-t border-white/20">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                    Admin Tools
                  </div>
                  {adminItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isCurrentPage(item.url)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'hover:bg-white/50 text-gray-700'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-800">Admin</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            <div className="p-4 border-t border-white/20">
              {isConnected ? (
                <div className="p-3 rounded-xl bg-white/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{publicKey?.toBase58()}</p>
                      <p className="text-xs text-green-700 font-semibold">Connected</p>
                    </div>
                  </div>
                  <Button onClick={disconnect} variant="outline" size="sm" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="p-3">
                  <Button onClick={connect} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 lg:ml-64">
          <main className="min-h-screen p-4 lg:p-8">
            {isConnected ? children : <ConnectWalletPrompt />}
          </main>
        </div>
      </div>
    </div>
  );
};

const ConnectWalletPrompt = () => {
  const { connect } = useWallet();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <Wallet className="w-24 h-24 text-indigo-300 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-6 max-w-sm">
        To use SolaPay, you need to connect your Solana wallet. This allows you to securely send and receive payments.
      </p>
      <Button onClick={connect} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600">
        Connect Wallet
      </Button>
    </div>
  );
};

export default function LayoutWrapper(props) {
  return (
    <WalletProvider>
      <AppLayout {...props} />
    </WalletProvider>
  );
}
