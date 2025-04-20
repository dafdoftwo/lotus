// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUq7yBq_gu_W5O6SLTUO2upQUFNa0blL8",
  authDomain: "loutus-higab.firebaseapp.com",
  projectId: "loutus-higab",
  storageBucket: "loutus-higab.firebasestorage.app",
  messagingSenderId: "971174136438",
  appId: "1:971174136438:web:a513b9b212260c34d52d57",
  measurementId: "G-6EHG240K0E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Authentication state
let currentUser = null;

// Orders data and pagination
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const ordersPerPage = 20;
let currentFilters = {
  status: "all",
  searchQuery: "",
  dateFrom: null,
  dateTo: null
};
let currentSort = "newest";

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Check auth state and redirect if needed
  checkAuthState();
  
  // Initialize event listeners
  initEventListeners();
  
  // Initialize date pickers
  initDatePickers();
});

// Authentication Functions
function checkAuthState() {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      currentUser = user;
      document.querySelector('.admin-dashboard').style.display = 'flex';
      loadOrders();
    } else {
      // User is signed out, redirect to login
      window.location.href = 'login.html';
    }
  });
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = 'login.html';
  }).catch(error => {
    console.error('Error signing out:', error);
    alert('حدث خطأ أثناء تسجيل الخروج');
  });
}

// Event Listeners
function initEventListeners() {
  // Logout button
  document.getElementById('logout-button').addEventListener('click', logout);
  
  // Status filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Apply filter
      currentFilters.status = tab.dataset.status;
      currentPage = 1;
      applyFilters();
    });
  });
  
  // Search input
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      currentFilters.searchQuery = searchInput.value.trim();
      currentPage = 1;
      applyFilters();
    }
  });
  
  searchButton.addEventListener('click', () => {
    currentFilters.searchQuery = searchInput.value.trim();
    currentPage = 1;
    applyFilters();
  });
  
  // Today's orders button
  document.getElementById('today-orders-button').addEventListener('click', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const datePickerFrom = document.getElementById('date-from')._flatpickr;
    const datePickerTo = document.getElementById('date-to')._flatpickr;
    
    datePickerFrom.setDate(today);
    datePickerTo.setDate(today);
    
    currentFilters.dateFrom = today;
    currentFilters.dateTo = today;
    currentPage = 1;
    applyFilters();
  });
  
  // Clear filters button
  document.getElementById('clear-filters-button').addEventListener('click', () => {
    // Reset all filters
    document.getElementById('search-input').value = '';
    document.getElementById('date-from')._flatpickr.clear();
    document.getElementById('date-to')._flatpickr.clear();
    
    // Reset filter tabs
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.filter-tab[data-status="all"]').classList.add('active');
    
    // Reset filter values
    currentFilters = {
      status: "all",
      searchQuery: "",
      dateFrom: null,
      dateTo: null
    };
    currentPage = 1;
    applyFilters();
  });
  
  // Sorting
  document.getElementById('sort-select').addEventListener('change', event => {
    currentSort = event.target.value;
    sortOrders();
    renderOrders();
  });
  
  // Pagination
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderOrders();
    }
  });
  
  document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderOrders();
    }
  });
  
  // Export button
  document.getElementById('export-button').addEventListener('click', exportOrders);
}

// Initialize Flatpickr Date Pickers
function initDatePickers() {
  const dateConfig = {
    locale: 'ar',
    dateFormat: 'd/m/Y',
    onChange: (selectedDates, dateStr, instance) => {
      if (instance.element.id === 'date-from') {
        currentFilters.dateFrom = selectedDates[0] ? selectedDates[0] : null;
      } else if (instance.element.id === 'date-to') {
        currentFilters.dateTo = selectedDates[0] ? selectedDates[0] : null;
      }
      
      if (currentFilters.dateFrom || currentFilters.dateTo) {
        currentPage = 1;
        applyFilters();
      }
    }
  };
  
  flatpickr('#date-from', dateConfig);
  flatpickr('#date-to', dateConfig);
}

// Orders Loading and Processing
function loadOrders() {
  // Show loading state
  document.getElementById('orders-table-body').innerHTML = '<tr><td colspan="10" class="loading-state">جاري تحميل الطلبات...</td></tr>';
  
  // Get orders from Firestore
  db.collection('orders')
    .orderBy('orderDate', 'desc')
    .get()
    .then(snapshot => {
      allOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          orderDate: data.orderDate && data.orderDate.toDate ? data.orderDate.toDate() : new Date()
        };
      });
      
      // Apply filters and render
      applyFilters();
      
      // Update stats
      updateStats();
    })
    .catch(error => {
      console.error('Error loading orders:', error);
      document.getElementById('orders-table-body').innerHTML = 
        '<tr><td colspan="10" class="error-state">حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.</td></tr>';
    });
}

function applyFilters() {
  // Filter orders based on current filters
  filteredOrders = allOrders.filter(order => {
    // Status filter
    if (currentFilters.status !== 'all' && order.status !== currentFilters.status) {
      return false;
    }
    
    // Search query (check order ID, customer name, and phone)
    if (currentFilters.searchQuery) {
      const query = currentFilters.searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(query);
      const matchesName = order.customerName && order.customerName.toLowerCase().includes(query);
      const matchesPhone = order.phone && order.phone.includes(query);
      
      if (!matchesId && !matchesName && !matchesPhone) {
        return false;
      }
    }
    
    // Date range
    if (currentFilters.dateFrom) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(currentFilters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      
      if (orderDate < fromDate) {
        return false;
      }
    }
    
    if (currentFilters.dateTo) {
      const orderDate = new Date(order.orderDate);
      const toDate = new Date(currentFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      
      if (orderDate > toDate) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort filtered orders
  sortOrders();
  
  // Render filtered orders
  renderOrders();
}

function sortOrders() {
  filteredOrders.sort((a, b) => {
    if (currentSort === 'newest') {
      return b.orderDate - a.orderDate;
    } else if (currentSort === 'oldest') {
      return a.orderDate - b.orderDate;
    }
    
    // Add more sorting options as needed
    return 0;
  });
}

function renderOrders() {
  const tableBody = document.getElementById('orders-table-body');
  
  // If no orders, show message
  if (filteredOrders.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="10" class="empty-state">لا توجد طلبات تطابق معايير البحث</td></tr>';
    document.getElementById('pagination-controls').style.display = 'none';
    return;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = Math.min(startIndex + ordersPerPage, filteredOrders.length);
  const ordersToShow = filteredOrders.slice(startIndex, endIndex);
  
  // Create order rows
  let rowsHtml = '';
  ordersToShow.forEach(order => {
    const orderDate = formatDate(order.orderDate);
    const statusClass = `status-${order.status || 'pending'}`;
    const statusText = getStatusText(order.status);
    
    // تحسين عرض رقم الطلب بالكامل
    const orderId = order.orderId || order.id;
    
    // إنشاء رسالة WhatsApp مختصرة للعرض في جدول الطلبات
    const whatsappMessage = encodeURIComponent(`السلام عليكم ${order.customerName || ''},\n\nشكراً لطلبك من لوتس! 🌟\nطلبك رقم #${orderId} قيد المراجعة.\nهل يمكننا التأكد من بياناتك؟\n\nفريق خدمة عملاء لوتس`);
    
    rowsHtml += `
      <tr data-id="${order.id}">
        <td class="order-id">${orderId}</td>
        <td class="customer-name">${escapeHtml(order.customerName || '')}</td>
        <td class="phone-number">
          <div class="contact-actions">
            <a href="tel:${order.phone}" class="contact-btn call-btn" title="اتصال مباشر">
              <i class="fas fa-phone"></i> ${order.phone || ''}
            </a>
            <a href="https://wa.me/${(order.phone || '').replace(/\D/g, '')}?text=${whatsappMessage}" 
               target="_blank" class="contact-btn whatsapp-btn" title="إرسال رسالة واتساب">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </td>
        <td class="governorate">${escapeHtml(order.governorate || order.city || '')}</td>
        <td class="order-date">${orderDate}</td>
        <td class="products-count">${order.items ? order.items.length : 0}</td>
        <td class="total-amount">${formatCurrency(order.totalAmount || 0)}</td>
        <td class="product-details">${formatProductDetails(order.items)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <button class="action-button view-button" data-id="${order.id}">
            <i class="fas fa-eye"></i> عرض
          </button>
        </td>
      </tr>
    `;
  });
  
  tableBody.innerHTML = rowsHtml;
  
  // Update pagination controls
  document.getElementById('pagination-controls').style.display = totalPages > 1 ? 'flex' : 'none';
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
  document.getElementById('page-info').textContent = `صفحة ${currentPage} من ${totalPages}`;
  
  // Add event listeners to view buttons
  document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', () => {
      const orderId = button.dataset.id;
      showOrderDetailsModal(orderId);
    });
  });
}

function updateStats() {
  // Calculate statistics
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
  const processingOrders = allOrders.filter(order => order.status === 'processing').length;
  const shippedOrders = allOrders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = allOrders.filter(order => order.status === 'delivered').length;
  
  // Calculate total revenue (from delivered orders)
  const totalRevenue = allOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  // Update DOM
  document.getElementById('total-orders').textContent = totalOrders;
  document.getElementById('pending-orders').textContent = pendingOrders;
  document.getElementById('processing-orders').textContent = processingOrders;
  document.getElementById('shipped-orders').textContent = shippedOrders;
  document.getElementById('delivered-orders').textContent = deliveredOrders;
  document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
}

// Utility Functions
function formatDate(date) {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('ar-EG', options);
}

function formatCurrency(amount) {
  return `${amount.toLocaleString('ar-EG')} ج.م`;
}

function formatProductDetails(items) {
  if (!items || !items.length) return '';
  
  return items.map(item => {
    // تنسيق أفضل للمنتجات مع تمييز اللون والمقاس
    return `<span class="product-color">${escapeHtml(item.color || '')}</span> - <span class="product-size">${escapeHtml(item.size || '')}</span> <span class="product-quantity">(${item.quantity || 1})</span>`;
  }).join(' | ');
}

function getStatusText(status) {
  switch (status) {
    case 'pending': return 'قيد الانتظار';
    case 'processing': return 'جاري التجهيز';
    case 'shipped': return 'تم الشحن';
    case 'delivered': return 'تم التوصيل';
    case 'cancelled': return 'ملغي';
    case 'returned': return 'مرتجع';
    default: return 'قيد الانتظار';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function exportOrders() {
  if (filteredOrders.length === 0) {
    alert('لا توجد طلبات للتصدير');
    return;
  }
  
  // Prepare data for export
  const exportData = filteredOrders.map(order => {
    return {
      'رقم الطلب': order.id,
      'اسم العميل': order.customerName || '',
      'رقم الهاتف': order.phone || '',
      'المحافظة': order.city || '',
      'العنوان': order.address || '',
      'تاريخ الطلب': formatDate(order.orderDate),
      'المنتجات': formatProductDetails(order.items),
      'المبلغ الإجمالي': order.totalAmount || 0,
      'الحالة': getStatusText(order.status),
      'طريقة الدفع': order.paymentMethod || ''
    };
  });
  
  // Generate CSV
  const csv = Papa.unparse(exportData);
  
  // Create and trigger download
  const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' }); // Add BOM for proper Arabic encoding
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `helden_orders_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Order Details Modal
function showOrderDetailsModal(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;
  
  // Check if modal exists, if not create it
  let modal = document.getElementById('order-details-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'order-details-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  
  // Format order data for display
  const orderDate = formatDate(order.orderDate);
  const statusClass = `status-${order.status || 'pending'}`;
  const statusText = getStatusText(order.status);
  
  // Create product items HTML
  let productsHtml = '';
  if (order.items && order.items.length) {
    order.items.forEach((item, index) => {
      productsHtml += `
        <div class="product-item" data-item-index="${index}">
          <div class="product-image">
            <img src="${item.image || 'img/placeholder.jpg'}" alt="صورة المنتج">
          </div>
          <div class="product-info">
            <h4>${escapeHtml(item.name || 'فستان لوتس')}</h4>
            <div class="editable-product-field">
              <label>اللون:</label>
              <input type="text" class="edit-item-color" value="${escapeHtml(item.color || '')}" data-original="${escapeHtml(item.color || '')}">
            </div>
            <div class="editable-product-field">
              <label>المقاس:</label>
              <input type="text" class="edit-item-size" value="${escapeHtml(item.size || '')}" data-original="${escapeHtml(item.size || '')}">
            </div>
            <div class="editable-product-field">
              <label>الكمية:</label>
              <input type="number" class="edit-item-quantity" value="${item.quantity || 1}" min="1" data-original="${item.quantity || 1}">
            </div>
            <p>السعر: ${formatCurrency(item.price || 0)}</p>
          </div>
        </div>
      `;
    });
  } else {
    productsHtml = '<p class="no-products">لا توجد منتجات</p>';
  }
  
  // Format the WhatsApp message with order summary
  const whatsappMessage = encodeURIComponent(`السلام عليكم ${order.customerName || ''},

شكراً لطلبك من لوتس! 🌟

*تفاصيل طلبك رقم #${order.orderId || order.id}:*
${order.items ? order.items.map(item => `- فستان لوتس (${item.color || ''} - ${item.size || ''}) × ${item.quantity || 1}`).join('\n') : ''}

*إجمالي المبلغ:* ${formatCurrency(order.totalAmount || 0)}

نرجو تأكيد البيانات التالية:
✓ الاسم: ${order.customerName || ''}
✓ العنوان: ${order.address || ''}, ${order.city || order.governorate || ''}
✓ الهاتف: ${order.phone || ''}

هل هذه البيانات صحيحة؟ وهل لديك أي استفسارات أخرى؟

فريق خدمة عملاء لوتس`);
  
  // Set modal content with editable fields
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>تفاصيل الطلب <span class="order-id-display">${order.id || order.orderId}</span></h2>
        <div class="modal-actions">
          <button id="edit-toggle-btn" class="edit-toggle-btn">
            <i class="fas fa-edit"></i> تعديل البيانات
          </button>
          <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="modal-body">
        <form id="order-edit-form">
          <div class="order-details-grid">
            <div class="details-column">
              <h3>معلومات العميل</h3>
              <div class="details-row">
                <span class="detail-label">الاسم:</span>
                <span class="detail-value detail-display">${escapeHtml(order.customerName || '')}</span>
                <div class="detail-edit">
                  <input type="text" name="customerName" value="${escapeHtml(order.customerName || '')}" data-original="${escapeHtml(order.customerName || '')}">
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">رقم الهاتف:</span>
                <span class="detail-value detail-display">
                  <div class="contact-actions">
                    <a href="tel:${order.phone}" class="contact-btn call-btn" title="اتصال مباشر">
                      <i class="fas fa-phone"></i> ${order.phone || ''}
                    </a>
                    <a href="https://wa.me/${order.phone.replace(/\D/g, '')}?text=${whatsappMessage}" 
                       target="_blank" class="contact-btn whatsapp-btn" title="إرسال رسالة واتساب">
                      <i class="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </span>
                <div class="detail-edit">
                  <input type="text" name="phone" value="${order.phone || ''}" data-original="${order.phone || ''}">
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">المحافظة:</span>
                <span class="detail-value detail-display">${escapeHtml(order.city || order.governorate || '')}</span>
                <div class="detail-edit">
                  <select name="governorate" data-original="${escapeHtml(order.city || order.governorate || '')}">
                    <option value="${escapeHtml(order.city || order.governorate || '')}" selected>${escapeHtml(order.city || order.governorate || '')}</option>
                    <option value="القاهرة">القاهرة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="المنصورة">المنصورة</option>
                    <option value="طنطا">طنطا</option>
                    <option value="أسيوط">أسيوط</option>
                    <option value="سوهاج">سوهاج</option>
                    <option value="المنيا">المنيا</option>
                    <option value="الزقازيق">الزقازيق</option>
                    <option value="بورسعيد">بورسعيد</option>
                    <option value="السويس">السويس</option>
                    <option value="الإسماعيلية">الإسماعيلية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">العنوان:</span>
                <span class="detail-value detail-display">${escapeHtml(order.address || '')}</span>
                <div class="detail-edit">
                  <textarea name="address" data-original="${escapeHtml(order.address || '')}">${escapeHtml(order.address || '')}</textarea>
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">طريقة الدفع:</span>
                <span class="detail-value detail-display">${escapeHtml(order.paymentMethod || 'الدفع عند الاستلام')}</span>
                <div class="detail-edit">
                  <select name="paymentMethod" data-original="${escapeHtml(order.paymentMethod || 'الدفع عند الاستلام')}">
                    <option value="الدفع عند الاستلام" ${(order.paymentMethod === 'الدفع عند الاستلام' || !order.paymentMethod) ? 'selected' : ''}>الدفع عند الاستلام</option>
                    <option value="بطاقة ائتمان" ${order.paymentMethod === 'بطاقة ائتمان' ? 'selected' : ''}>بطاقة ائتمان</option>
                    <option value="تحويل بنكي" ${order.paymentMethod === 'تحويل بنكي' ? 'selected' : ''}>تحويل بنكي</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="details-column">
              <h3>معلومات الطلب</h3>
              <div class="details-row">
                <span class="detail-label">رقم الطلب:</span>
                <span class="detail-value detail-display">${order.id || order.orderId}</span>
                <div class="detail-edit">
                  <input type="text" name="orderId" value="${order.orderId || order.id}" data-original="${order.orderId || order.id}">
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">تاريخ الطلب:</span>
                <span class="detail-value detail-display">${orderDate}</span>
                <div class="detail-edit">
                  <input type="text" class="flatpickr-date" name="orderDate" value="${orderDate}" data-original="${orderDate}">
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">حالة الطلب:</span>
                <span class="detail-value detail-display">
                  <span class="status-badge ${statusClass}">${statusText}</span>
                </span>
                <div class="detail-edit">
                  <select name="status" data-original="${order.status || 'pending'}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>جاري التجهيز</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                    <option value="returned" ${order.status === 'returned' ? 'selected' : ''}>مرتجع</option>
                  </select>
                </div>
              </div>
              <div class="details-row">
                <span class="detail-label">عدد المنتجات:</span>
                <span class="detail-value detail-display">${order.items ? order.items.length : 0}</span>
              </div>
              <div class="details-row">
                <span class="detail-label">إجمالي السعر:</span>
                <span class="detail-value detail-display">${formatCurrency(order.totalAmount || 0)}</span>
                <div class="detail-edit">
                  <input type="number" name="totalAmount" value="${order.totalAmount || 0}" step="0.01" data-original="${order.totalAmount || 0}">
                </div>
              </div>
              ${order.notes ? `
              <div class="details-row">
                <span class="detail-label">ملاحظات:</span>
                <span class="detail-value detail-display">${escapeHtml(order.notes)}</span>
                <div class="detail-edit">
                  <textarea name="notes" data-original="${escapeHtml(order.notes)}">${escapeHtml(order.notes)}</textarea>
                </div>
              </div>` : `
              <div class="details-row detail-edit">
                <span class="detail-label">ملاحظات:</span>
                <div class="detail-edit">
                  <textarea name="notes" data-original=""></textarea>
                </div>
              </div>`}
            </div>
          </div>
          
          <div class="products-section">
            <h3>المنتجات</h3>
            <div class="products-container">
              ${productsHtml}
            </div>
          </div>
          
          <div class="edit-actions">
            <button type="button" id="save-changes-btn" class="save-changes-btn">
              <i class="fas fa-save"></i> حفظ التغييرات
            </button>
            <button type="button" id="cancel-edit-btn" class="cancel-edit-btn">
              <i class="fas fa-times"></i> إلغاء
            </button>
          </div>
          
          <div class="status-update-section">
            <h3>تحديث حالة الطلب</h3>
            <div class="status-buttons">
              <button type="button" class="status-button status-pending" data-status="pending">قيد الانتظار</button>
              <button type="button" class="status-button status-processing" data-status="processing">جاري التجهيز</button>
              <button type="button" class="status-button status-shipped" data-status="shipped">تم الشحن</button>
              <button type="button" class="status-button status-delivered" data-status="delivered">تم التوصيل</button>
              <button type="button" class="status-button status-cancelled" data-status="cancelled">ملغي</button>
              <button type="button" class="status-button status-returned" data-status="returned">مرتجع</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Show modal
  modal.style.display = 'flex';
  
  // Initialize flatpickr for date fields
  const dateFields = modal.querySelectorAll('.flatpickr-date');
  if (dateFields.length) {
    dateFields.forEach(field => {
      flatpickr(field, {
        locale: 'ar',
        dateFormat: 'd/m/Y',
        allowInput: true
      });
    });
  }
  
  // Add event listeners
  const closeButton = modal.querySelector('.close-modal');
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Add click outside to close
  window.addEventListener('click', event => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Toggle edit mode
  const editToggleBtn = modal.querySelector('#edit-toggle-btn');
  const editForm = modal.querySelector('#order-edit-form');
  
  editToggleBtn.addEventListener('click', () => {
    editForm.classList.toggle('edit-mode');
    if (editForm.classList.contains('edit-mode')) {
      editToggleBtn.innerHTML = '<i class="fas fa-eye"></i> عرض البيانات';
    } else {
      editToggleBtn.innerHTML = '<i class="fas fa-edit"></i> تعديل البيانات';
    }
  });
  
  // Cancel edit button
  const cancelEditBtn = modal.querySelector('#cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => {
    // Reset all fields to original values
    const editFields = modal.querySelectorAll('input, textarea, select');
    editFields.forEach(field => {
      const originalValue = field.getAttribute('data-original');
      if (originalValue !== null) {
        field.value = originalValue;
      }
    });
    
    // Exit edit mode
    editForm.classList.remove('edit-mode');
    editToggleBtn.innerHTML = '<i class="fas fa-edit"></i> تعديل البيانات';
  });
  
  // Save changes button
  const saveChangesBtn = modal.querySelector('#save-changes-btn');
  saveChangesBtn.addEventListener('click', () => {
    // Collect form data
    const formData = new FormData(editForm);
    const updatedData = {};
    
    // Process basic fields
    for (const [key, value] of formData.entries()) {
      if (key === 'orderDate') {
        // Skip date field, will handle separately for Firestore timestamp
        continue;
      }
      
      if (key === 'totalAmount') {
        updatedData[key] = parseFloat(value);
      } else {
        updatedData[key] = value;
      }
    }
    
    // Process items data
    if (order.items && order.items.length) {
      const updatedItems = [...order.items];
      const itemElements = modal.querySelectorAll('.product-item');
      
      itemElements.forEach(itemElement => {
        const index = parseInt(itemElement.getAttribute('data-item-index'), 10);
        if (isNaN(index) || index >= updatedItems.length) return;
        
        const colorInput = itemElement.querySelector('.edit-item-color');
        const sizeInput = itemElement.querySelector('.edit-item-size');
        const quantityInput = itemElement.querySelector('.edit-item-quantity');
        
        if (colorInput && sizeInput && quantityInput) {
          updatedItems[index] = {
            ...updatedItems[index],
            color: colorInput.value,
            size: sizeInput.value,
            quantity: parseInt(quantityInput.value, 10) || 1
          };
        }
      });
      
      updatedData.items = updatedItems;
    }
    
    // Add timestamp for last update
    updatedData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    
    // Handle date change if needed
    const dateInput = modal.querySelector('input[name="orderDate"]');
    if (dateInput && dateInput.value !== dateInput.getAttribute('data-original')) {
      try {
        const dateParts = dateInput.value.split('/');
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // months are 0-indexed
          const year = parseInt(dateParts[2], 10);
          
          const dateObj = new Date(year, month, day);
          updatedData.orderDate = firebase.firestore.Timestamp.fromDate(dateObj);
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    }
    
    // Update in Firestore
    db.collection('orders').doc(order.id).update(updatedData)
      .then(() => {
        // Success - update local data
        Object.assign(order, updatedData);
        
        // Update UI in modal
        const statusBadge = modal.querySelector('.status-badge');
        statusBadge.className = `status-badge status-${updatedData.status || order.status}`;
        statusBadge.textContent = getStatusText(updatedData.status || order.status);
        
        // Update display values
        const displayFields = modal.querySelectorAll('.detail-value.detail-display');
        displayFields.forEach(field => {
          const row = field.closest('.details-row');
          if (!row) return;
          
          const labelElement = row.querySelector('.detail-label');
          if (!labelElement) return;
          
          const label = labelElement.textContent.replace(':', '').trim();
          let value = '';
          
          switch (label) {
            case 'الاسم':
              value = updatedData.customerName || order.customerName || '';
              field.textContent = value;
              break;
            case 'رقم الهاتف':
              // Skip, handled separately for contact buttons
              break;
            case 'المحافظة':
              value = updatedData.governorate || updatedData.city || order.governorate || order.city || '';
              field.textContent = value;
              break;
            case 'العنوان':
              value = updatedData.address || order.address || '';
              field.textContent = value;
              break;
            case 'طريقة الدفع':
              value = updatedData.paymentMethod || order.paymentMethod || 'الدفع عند الاستلام';
              field.textContent = value;
              break;
            case 'رقم الطلب':
              value = updatedData.orderId || order.orderId || order.id;
              field.textContent = value;
              // Also update the header
              const orderIdDisplay = modal.querySelector('.order-id-display');
              if (orderIdDisplay) orderIdDisplay.textContent = value;
              break;
            case 'تاريخ الطلب':
              // This will be updated next time the modal is opened
              break;
            case 'إجمالي السعر':
              value = formatCurrency(updatedData.totalAmount || order.totalAmount || 0);
              field.textContent = value;
              break;
            case 'ملاحظات':
              value = updatedData.notes || order.notes || '';
              field.textContent = value;
              break;
          }
        });
        
        // Update product items display
        if (updatedData.items) {
          const productElements = modal.querySelectorAll('.product-item');
          productElements.forEach((element, index) => {
            if (index >= updatedData.items.length) return;
            
            const item = updatedData.items[index];
            const colorDisplay = element.querySelector('.product-info p:nth-child(2)');
            const sizeDisplay = element.querySelector('.product-info p:nth-child(3)');
            const quantityDisplay = element.querySelector('.product-info p:nth-child(4)');
            
            if (colorDisplay) colorDisplay.textContent = `اللون: ${item.color || ''}`;
            if (sizeDisplay) sizeDisplay.textContent = `المقاس: ${item.size || ''}`;
            if (quantityDisplay) quantityDisplay.textContent = `الكمية: ${item.quantity || 1}`;
          });
        }
        
        // Update table row if visible
        const row = document.querySelector(`tr[data-id="${order.id}"]`);
        if (row) {
          const customerNameCell = row.querySelector('td:nth-child(2)');
          const phoneCell = row.querySelector('td:nth-child(3)');
          const governorateCell = row.querySelector('td:nth-child(4)');
          const statusCell = row.querySelector('.status-badge');
          const productsCell = row.querySelector('td:nth-child(8)');
          
          if (customerNameCell) customerNameCell.textContent = updatedData.customerName || order.customerName || '';
          if (phoneCell) {
            const phoneLink = phoneCell.querySelector('a');
            if (phoneLink) {
              phoneLink.href = `tel:${updatedData.phone || order.phone}`;
              phoneLink.textContent = updatedData.phone || order.phone || '';
            }
          }
          if (governorateCell) governorateCell.textContent = updatedData.governorate || updatedData.city || order.governorate || order.city || '';
          if (statusCell) {
            statusCell.className = `status-badge status-${updatedData.status || order.status}`;
            statusCell.textContent = getStatusText(updatedData.status || order.status);
          }
          if (productsCell && updatedData.items) {
            productsCell.innerHTML = formatProductDetails(updatedData.items);
          }
        }
        
        // Update WhatsApp link with new data
        const whatsappBtn = modal.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
          const updatedWhatsappMessage = encodeURIComponent(`السلام عليكم ${updatedData.customerName || order.customerName || ''},

شكراً لطلبك من لوتس! 🌟

*تفاصيل طلبك رقم #${updatedData.orderId || order.orderId || order.id}:*
${updatedData.items ? updatedData.items.map(item => `- فستان لوتس (${item.color || ''} - ${item.size || ''}) × ${item.quantity || 1}`).join('\n') : ''}

*إجمالي المبلغ:* ${formatCurrency(updatedData.totalAmount || order.totalAmount || 0)}

نرجو تأكيد البيانات التالية:
✓ الاسم: ${updatedData.customerName || order.customerName || ''}
✓ العنوان: ${updatedData.address || order.address || ''}, ${updatedData.governorate || updatedData.city || order.governorate || order.city || ''}
✓ الهاتف: ${updatedData.phone || order.phone || ''}

هل هذه البيانات صحيحة؟ وهل لديك أي استفسارات أخرى؟

فريق خدمة عملاء لوتس`);
          
          whatsappBtn.href = `https://wa.me/${(updatedData.phone || order.phone || '').replace(/\D/g, '')}?text=${updatedWhatsappMessage}`;
        }
        
        // Update stats
        updateStats();
        
        // Show success notification
        showNotification('تم تحديث بيانات الطلب بنجاح', 'success');
        
        // Exit edit mode
        editForm.classList.remove('edit-mode');
        editToggleBtn.innerHTML = '<i class="fas fa-edit"></i> تعديل البيانات';
      })
      .catch(error => {
        console.error('Error updating order:', error);
        showNotification('حدث خطأ أثناء تحديث بيانات الطلب', 'error');
      });
  });
  
  // Status update event listeners
  const statusButtons = modal.querySelectorAll('.status-button');
  statusButtons.forEach(button => {
    // Highlight current status
    if (button.dataset.status === order.status) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', () => {
      const newStatus = button.dataset.status;
      updateOrderStatus(order.id, newStatus);
    });
  });
}

function updateOrderStatus(orderId, newStatus) {
  // Update in Firestore
  db.collection('orders').doc(orderId).update({
    status: newStatus,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    // Success - update local data
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = newStatus;
      
      // Update UI
      const modal = document.getElementById('order-details-modal');
      
      // Update status in modal
      const statusBadge = modal.querySelector('.status-badge');
      statusBadge.className = `status-badge status-${newStatus}`;
      statusBadge.textContent = getStatusText(newStatus);
      
      // Update active button
      modal.querySelectorAll('.status-button').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.status === newStatus) {
          button.classList.add('active');
        }
      });
      
      // Update table row if visible
      const row = document.querySelector(`tr[data-id="${orderId}"]`);
      if (row) {
        const statusCell = row.querySelector('.status-badge');
        statusCell.className = `status-badge status-${newStatus}`;
        statusCell.textContent = getStatusText(newStatus);
      }
      
      // Update stats
      updateStats();
      
      // Show success notification
      showNotification('تم تحديث حالة الطلب بنجاح', 'success');
    }
  }).catch(error => {
    console.error('Error updating order status:', error);
    showNotification('حدث خطأ أثناء تحديث حالة الطلب', 'error');
  });
}

function showNotification(message, type = 'info') {
  // Check if notifications container exists
  let container = document.querySelector('.notifications-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notifications-container';
    document.body.appendChild(container);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="notification-icon fas ${getNotificationIcon(type)}"></i>
      <span class="notification-message">${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add to container
  container.appendChild(notification);
  
  // Add close listener
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-info-circle';
  }
} 