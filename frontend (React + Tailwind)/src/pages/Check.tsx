import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { User, Heart, Package, FileText, MapPin, Settings, LogOut, Download, Eye, X } from "lucide-react";
import { Navigate } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import BrandIcon from "@/components/BrandIcon";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "orders", label: "Orders", icon: Package },
  { id: "tracking", label: "Tracking", icon: MapPin },
  { id: "receipts", label: "Receipts", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const Dashboard = () => {
  const { user, wishlist, userOrders, logout, updateProfile } = useApp();
  const [tab, setTab] = useState("profile");
  const [editName, setEditName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<typeof userOrders[0] | null>(null);

  if (!user) return <Navigate to="/login" state={{ from: "/dashboard" }} replace />;

  const wishedProducts = products.filter(p => wishlist.includes(p.id));
  const pendingCount = userOrders.filter(o => o.status === "pending").length;

  const handleSaveName = () => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() });
      toast.success("Name updated");
    }
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6 md:mb-8">Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="glass-card p-3 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setViewReceipt(null); }} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap relative ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                  {t.id === "orders" && pendingCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-bold">{pendingCount}</span>
                  )}
                </button>
              ))}
              <button onClick={logout} className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap mt-0 md:mt-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          <div className="flex-1 animate-fade-in min-w-0">
            {tab === "profile" && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-display text-lg md:text-xl font-bold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    {isEditingName ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-sm" />
                        <div className="flex gap-2">
                          <button onClick={handleSaveName} className="btn-primary-glow text-sm px-4 flex-1 sm:flex-none">Save</button>
                          <button onClick={() => setIsEditingName(false)} className="px-3 py-2 text-sm rounded-xl border border-input hover:bg-secondary flex-1 sm:flex-none">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={user.name} readOnly className="flex-1 px-4 py-3 rounded-xl border border-input bg-secondary/30 text-sm cursor-default" />
                        <button onClick={() => { setEditName(user.name); setIsEditingName(true); }} className="px-3 py-2 text-sm rounded-xl border border-input hover:bg-secondary">Edit</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <input type="email" value={user.email} readOnly className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/30 text-sm cursor-default text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "wishlist" && (
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold mb-4">My Wishlist</h2>
                {wishedProducts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No items in your wishlist yet.</p>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {wishedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                  </div>
                )}
              </div>
            )}

            {tab === "orders" && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-display text-lg md:text-xl font-bold mb-4">Order History</h2>
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 text-muted" />
                    <p>No orders yet. Start shopping!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div key={order.id} className="p-3 md:p-4 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">{order.id}</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>{new Date(order.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                          <p>Payment: {order.paymentMethod || "N/A"}</p>
                          {order.items.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <img src={item.product.image} alt="" className="w-6 h-6 rounded object-cover" />
                                  <span className="truncate">{item.product.name} x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-border text-sm font-semibold">
                          <span>Total</span><span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "tracking" && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-display text-lg md:text-xl font-bold mb-4">Order Tracking</h2>
                {userOrders.filter(o => o.status !== "delivered" && o.status !== "declined").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-muted" />
                    <p>No active orders to track.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.filter(o => o.status !== "delivered" && o.status !== "declined").map(order => (
                      <div key={order.id} className="p-3 md:p-4 rounded-xl border border-border">
                        <div className="flex justify-between mb-3">
                          <span className="text-sm font-semibold">{order.id}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString("en-NG")}</span>
                        </div>
                        {order.items.length > 0 && (
                          <div className="mb-3 space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <img src={item.product.image} alt="" className="w-6 h-6 rounded object-cover" />
                                <span className="truncate">{item.product.name} x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {["pending", "shipped", "delivered"].map((s, i) => {
                            const steps = ["pending", "shipped", "delivered"];
                            const current = steps.indexOf(order.status);
                            const active = i <= current;
                            return (
                              <div key={s} className="flex items-center gap-2 flex-1">
                                <div className={`w-3 h-3 rounded-full shrink-0 ${active ? "bg-primary" : "bg-muted"}`} />
                                <span className={`text-[10px] capitalize ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                                {i < 2 && <div className={`flex-1 h-px ${active ? "bg-primary" : "bg-muted"}`} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "receipts" && !viewReceipt && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-display text-lg md:text-xl font-bold mb-4">Receipts</h2>
                {userOrders.filter(o => o.status === "delivered").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted" />
                    <p>No receipts available.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.filter(o => o.status === "delivered").map(order => (
                      <div key={order.id} className="p-3 md:p-4 rounded-xl border border-border">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold">{order.id}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString("en-NG")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.items.map((item, i) => <p key={i}>{item.product.name} x{item.quantity} — {formatPrice(item.product.price * item.quantity)}</p>)}
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-border text-sm font-semibold">
                          <span>Total</span><span>{formatPrice(order.total)}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setViewReceipt(order)} className="flex items-center gap-1 text-[10px] text-primary font-medium hover:underline"><Eye className="w-3 h-3" /> View</button>
                          <button onClick={() => {
                            const fulfillmentLine = order.fulfillment === "pickup" && order.pickupLocation
                              ? `\nFulfillment: PICKUP\nLocation: ${order.pickupLocation.name}\n  ${order.pickupLocation.address}\n  ${order.pickupLocation.city}, ${order.pickupLocation.state}\n  Phone: ${order.pickupLocation.phoneNumber}`
                              : order.fulfillment === "delivery" && order.shippingAddress
                              ? `\nFulfillment: DELIVERY\nDeliver to: ${order.shippingAddress.fullName}\n  ${order.shippingAddress.address}\n  ${order.shippingAddress.city}, ${order.shippingAddress.state}\n  Phone: ${order.shippingAddress.phone}`
                              : "";
                            const receiptText = `AESTRA-TECH RECEIPT\n${"=".repeat(30)}\nOrder: ${order.id}\nDate: ${new Date(order.date).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\nCustomer: ${order.customerName}\nEmail: ${order.customerEmail}\nPayment: ${order.paymentMethod || "N/A"}${fulfillmentLine}\n${"=".repeat(30)}\nITEMS:\n${order.items.map(item => `  ${item.product.name} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`).join("\n")}\n${"=".repeat(30)}\nTOTAL: ${formatPrice(order.total)}\n\nThank you for shopping with AESTRA-TECH!`;
                            const blob = new Blob([receiptText], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url; a.download = `receipt-${order.id}.txt`;
                            a.click(); URL.revokeObjectURL(url);
                            toast.success("Receipt downloaded");
                          }} className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium hover:text-foreground"><Download className="w-3 h-3" /> Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "receipts" && viewReceipt && (
              <div className="glass-card p-4 md:p-6 animate-fade-in">
                <button onClick={() => setViewReceipt(null)} className="text-xs text-primary font-medium hover:underline mb-4 block">← Back to Receipts</button>
                <div className="border border-border rounded-2xl overflow-hidden max-w-lg mx-auto bg-card shadow-lg">
                  {/* Receipt Header */}
                  <div className="bg-primary px-6 py-5 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-foreground text-lg font-black">A</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-primary-foreground">AESTRA-TECH</h3>
                    <p className="text-xs text-primary-foreground/70 mt-1">Official Purchase Receipt</p>
                  </div>

                  <div className="p-5 md:p-6 space-y-5">
                    {/* Order Meta */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">Order ID</p>
                        <p className="font-semibold font-mono text-[11px]">{viewReceipt.id}</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(viewReceipt.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">{viewReceipt.customerName}</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-muted-foreground">Payment</p>
                        <p className="font-medium capitalize">{viewReceipt.paymentMethod || "N/A"}</p>
                      </div>
                      <div className="col-span-2 space-y-0.5">
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{viewReceipt.customerEmail}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-border" />

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Items Purchased</p>
                      <div className="space-y-3">
                        {viewReceipt.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.product.image} alt="" className="w-11 h-11 rounded-lg object-cover border border-border" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.product.name}</p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1"><BrandIcon brand={item.product.brand} className="w-3 h-3" />{item.product.brand} · Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment / Pickup Location */}
                    {viewReceipt.fulfillment === "pickup" && viewReceipt.pickupLocation && (
                      <div className="border-t border-dashed border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pickup Location</p>
                        <div className="rounded-xl bg-secondary/40 p-3 space-y-1">
                          <p className="text-sm font-semibold">{viewReceipt.pickupLocation.name}</p>
                          <p className="text-xs text-muted-foreground">{viewReceipt.pickupLocation.address}</p>
                          <p className="text-[11px] text-muted-foreground">{viewReceipt.pickupLocation.city}, {viewReceipt.pickupLocation.state}</p>
                          <p className="text-[11px] text-muted-foreground">📞 {viewReceipt.pickupLocation.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    {viewReceipt.fulfillment === "delivery" && viewReceipt.shippingAddress && (
                      <div className="border-t border-dashed border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Delivery Address</p>
                        <div className="rounded-xl bg-secondary/40 p-3 space-y-0.5">
                          <p className="text-sm font-medium">{viewReceipt.shippingAddress.fullName}</p>
                          <p className="text-xs text-muted-foreground">{viewReceipt.shippingAddress.address}</p>
                          <p className="text-[11px] text-muted-foreground">{viewReceipt.shippingAddress.city}, {viewReceipt.shippingAddress.state}</p>
                          <p className="text-[11px] text-muted-foreground">📞 {viewReceipt.shippingAddress.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="border-t border-dashed border-border pt-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span><span>{formatPrice(viewReceipt.total)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Shipping</span><span>Free</span>
                      </div>
                      <div className="flex justify-between font-display font-bold text-base pt-2 border-t border-border">
                        <span>Total</span><span className="text-primary">{formatPrice(viewReceipt.total)}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-2">
                      <p className="text-[10px] text-muted-foreground">Thank you for shopping with AESTRA-TECH!</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">support@aestra-tech.com</p>
                    </div>

                    <button onClick={() => {
                      const receiptText = `AESTRA-TECH RECEIPT\n${"=".repeat(40)}\nOrder: ${viewReceipt.id}\nDate: ${new Date(viewReceipt.date).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\nCustomer: ${viewReceipt.customerName}\nEmail: ${viewReceipt.customerEmail}\nPayment: ${viewReceipt.paymentMethod || "N/A"}\n${"=".repeat(40)}\n\nITEMS:\n${viewReceipt.items.map(item => `  ${item.product.name}\n    Qty: ${item.quantity}  Price: ${formatPrice(item.product.price * item.quantity)}`).join("\n\n")}\n\n${"=".repeat(40)}\nTOTAL: ${formatPrice(viewReceipt.total)}\n${"=".repeat(40)}\n\nThank you for shopping with AESTRA-TECH!\nsupport@aestra-tech.com`;
                      const blob = new Blob([receiptText], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = `receipt-${viewReceipt.id}.txt`;
                      a.click(); URL.revokeObjectURL(url);
                      toast.success("Receipt downloaded");
                    }} className="w-full btn-primary-glow text-xs flex items-center justify-center gap-2">
                      <Download className="w-3.5 h-3.5" /> Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-display text-lg md:text-xl font-bold mb-4">Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl border border-input">
                    <span className="text-sm font-medium">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl border border-input">
                    <span className="text-sm font-medium">SMS Notifications</span>
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;













































<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('order_number')->unique();
            $table->string('reference')->nullable()->unique();

            // Delivery or Pickup
            $table->enum('fulfillment', ['delivery','pickup']);

            // Customer
            $table->string('full_name');
            $table->string('phone');

            // Delivery
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->text('address')->nullable();

            // Pickup
            $table->string('pickup_state')->nullable();
            $table->string('pickup_location')->nullable();

            // Payment
            $table->enum('payment_method', ['paystack','bank_transfer']);

            $table->enum('payment_status', ['pending','paid','failed'])->default('pending');

            // Order status
            $table->enum('status', ['pending','processing','delivered','ready_for_pickup','picked_up','completed','cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

