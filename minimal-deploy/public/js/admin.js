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
    .orderBy('orderInfo.orderDate', 'desc')
    .get()
    .then((querySnapshot) => {
      // Reset orders array
      allOrders = [];
      
      // Process orders
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        // Add document ID to order data
        order.id = doc.id;
        
        // Format order date
        if (order.orderInfo && order.orderInfo.orderDate) {
          const timestamp = order.orderInfo.orderDate;
          order.formattedDate = formatDate(timestamp.toDate());
          order.dateObj = timestamp.toDate();
        } else {
          order.formattedDate = 'تاريخ غير محدد';
          order.dateObj = new Date(0); // Default to epoch
        }
        
        // Add to orders array
        allOrders.push(order);
      });
      
      // Update all displays
      applyFilters();
      updateStats();
      
      // Show the pagination controls if needed
      document.getElementById('pagination-controls').style.display = 'flex';
    })
    .catch((error) => {
      console.error("Error loading orders: ", error);
      document.getElementById('orders-table-body').innerHTML = `<tr><td colspan="10" class="error-state">حدث خطأ أثناء تحميل الطلبات: ${error.message}</td></tr>`;
    });
}

function applyFilters() {
  filteredOrders = allOrders.filter(order => {
    // Status filter
    if (currentFilters.status !== 'all' && order.orderInfo?.status !== currentFilters.status) {
      return false;
    }
    
    // Date filter
    if (currentFilters.dateFrom) {
      const startDate = new Date(currentFilters.dateFrom);
      startDate.setHours(0, 0, 0, 0);
      if (order.dateObj < startDate) {
        return false;
      }
    }
    
    if (currentFilters.dateTo) {
      const endDate = new Date(currentFilters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      if (order.dateObj > endDate) {
        return false;
      }
    }
    
    // Search query filter
    if (currentFilters.searchQuery) {
      const query = currentFilters.searchQuery.toLowerCase();
      // Search in customer name
      const customerName = order.customerInfo?.name || '';
      if (customerName.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in phone
      const phone = order.customerInfo?.phone || '';
      if (phone.includes(query)) {
        return true;
      }
      
      // Search in order ID
      const orderId = order.orderInfo?.orderId || '';
      if (orderId.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in address
      const address = order.customerInfo?.address || '';
      if (address.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    }
    
    return true;
  });
  
  // Sort filtered orders
  sortOrders();
  
  // Render orders
  renderOrders();
  
  // Update order count
  document.getElementById('filtered-count').textContent = filteredOrders.length;
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
  
  // Calculate pagination
  const start = (currentPage - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  const ordersToShow = filteredOrders.slice(start, end);
  
  // Update pagination controls
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  document.getElementById('page-info').textContent = `صفحة ${currentPage} من ${totalPages}`;
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
  
  // Clear current table content
  tableBody.innerHTML = '';
  
  // No orders to display
  if (ordersToShow.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="10" class="no-orders">لا توجد طلبات مطابقة للفلتر</td></tr>';
    return;
  }
  
  // Generate rows
  ordersToShow.forEach(order => {
    // Create table row
    const row = document.createElement('tr');
    
    // Order ID
    const tdOrderId = document.createElement('td');
    tdOrderId.textContent = order.orderInfo?.orderId || 'غير محدد';
    row.appendChild(tdOrderId);
    
    // Customer Name
    const tdCustomerName = document.createElement('td');
    tdCustomerName.textContent = order.customerInfo?.name || 'غير محدد';
    row.appendChild(tdCustomerName);
    
    // Phone Number
    const tdPhone = document.createElement('td');
    const phoneLink = document.createElement('a');
    phoneLink.href = `tel:${order.customerInfo?.phone || ''}`;
    phoneLink.innerHTML = `<i class="fas fa-phone"></i> ${order.customerInfo?.phone || 'غير محدد'}`;
    tdPhone.appendChild(phoneLink);
    row.appendChild(tdPhone);
    
    // Governorate
    const tdGovernorate = document.createElement('td');
    tdGovernorate.textContent = order.customerInfo?.governorate || 'غير محدد';
    row.appendChild(tdGovernorate);
    
    // Order Date
    const tdDate = document.createElement('td');
    tdDate.textContent = order.formattedDate;
    row.appendChild(tdDate);
    
    // Number of Products
    const tdProductsCount = document.createElement('td');
    tdProductsCount.textContent = order.orderDetails?.products?.length || 0;
    row.appendChild(tdProductsCount);
    
    // Total Amount
    const tdAmount = document.createElement('td');
    tdAmount.textContent = formatCurrency(order.orderDetails?.totalAmount || 0);
    row.appendChild(tdAmount);
    
    // Product Details
    const tdProductDetails = document.createElement('td');
    tdProductDetails.className = 'product-details';
    tdProductDetails.innerHTML = formatProductDetails(order.orderDetails?.products || []);
    row.appendChild(tdProductDetails);
    
    // Status
    const tdStatus = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${order.orderInfo?.status || 'pending'}`;
    statusBadge.textContent = getStatusText(order.orderInfo?.status || 'pending');
    tdStatus.appendChild(statusBadge);
    row.appendChild(tdStatus);
    
    // Actions
    const tdActions = document.createElement('td');
    const viewButton = document.createElement('button');
    viewButton.className = 'action-button view-button';
    viewButton.textContent = 'عرض';
    viewButton.addEventListener('click', () => showOrderDetailsModal(order.id));
    tdActions.appendChild(viewButton);
    row.appendChild(tdActions);
    
    // Add row to table
    tableBody.appendChild(row);
  });
}

function updateStats() {
  // Count orders by status
  const counts = {
    total: allOrders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0
  };
  
  // Calculate total revenue
  let totalRevenue = 0;
  
  allOrders.forEach(order => {
    const status = order.orderInfo?.status || 'pending';
    if (counts.hasOwnProperty(status)) {
      counts[status]++;
    }
    
    // Add to total revenue if order is not cancelled or returned
    if (status !== 'cancelled' && status !== 'returned') {
      totalRevenue += order.orderDetails?.totalAmount || 0;
    }
  });
  
  // Update stats display
  document.getElementById('total-orders').textContent = counts.total;
  document.getElementById('pending-orders').textContent = counts.pending;
  document.getElementById('processing-orders').textContent = counts.processing;
  document.getElementById('shipped-orders').textContent = counts.shipped;
  document.getElementById('delivered-orders').textContent = counts.delivered;
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

function formatProductDetails(products) {
  if (!products || products.length === 0) {
    return 'لا توجد منتجات';
  }
  
  // Group products by color and size
  const productsByColorAndSize = {};
  
  products.forEach(product => {
    const key = `${product.color} - ${product.size}`;
    if (productsByColorAndSize[key]) {
      productsByColorAndSize[key].count++;
    } else {
      productsByColorAndSize[key] = {
        color: product.color,
        size: product.size,
        count: 1
      };
    }
  });
  
  // Format the grouped products
  return Object.values(productsByColorAndSize)
    .map(item => `${item.color} - ${item.size} (${item.count})`)
    .join(' | ');
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'قيد الانتظار',
    'processing': 'جاري التجهيز',
    'shipped': 'تم الشحن',
    'delivered': 'تم التوصيل',
    'cancelled': 'ملغي',
    'returned': 'مرتجع'
  };
  
  return statusMap[status] || statusMap.pending;
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
  // Get order from Firestore
  db.collection('orders').doc(orderId).get()
    .then((doc) => {
      if (doc.exists) {
        const order = doc.data();
        // Add document ID to order data
        order.id = doc.id;
        
        // Create modal HTML
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'order-details-modal';
        
        // Format order date
        const orderDate = order.orderInfo?.orderDate ? formatDate(order.orderInfo.orderDate.toDate()) : 'تاريخ غير محدد';
        
        // Format products
        const productsHTML = (order.orderDetails?.products || []).map(product => {
          return `
            <div class="product-card">
              <div class="product-info">
                <span class="product-name">فستان لوتس</span>
                <div class="product-details">
                  <span class="product-color"><i class="fas fa-tint"></i> ${product.color}</span>
                  <span class="product-size"><i class="fas fa-ruler"></i> ${product.size}</span>
                  <span class="product-price"><i class="fas fa-tag"></i> ${product.price} ج.م</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
        
        // Format order status options
        const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
          .map(status => {
            const selected = status === (order.orderInfo?.status || 'pending') ? 'selected' : '';
            return `<option value="${status}" ${selected}>${getStatusText(status)}</option>`;
          }).join('');
        
        // Create modal content
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
              <h3>تفاصيل الطلب #${order.orderInfo?.orderId || ''}</h3>
              <button class="close-modal" id="close-modal">×</button>
            </div>
            <div class="modal-body">
              <div class="modal-grid">
                <div class="order-info-section">
                  <h4>معلومات الطلب</h4>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">رقم الطلب:</span>
                      <span class="info-value">${order.orderInfo?.orderId || ''}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">تاريخ الطلب:</span>
                      <span class="info-value">${orderDate}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">طريقة الدفع:</span>
                      <span class="info-value">${order.customerInfo?.paymentMethod || 'الدفع عند الاستلام'}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">حالة الطلب:</span>
                      <div class="status-select-container">
                        <select id="status-select" class="status-select">
                          ${statusOptions}
                        </select>
                        <button id="update-status-btn" class="update-status-btn" data-order-id="${orderId}">
                          <i class="fas fa-save"></i> تحديث الحالة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="customer-info-section">
                  <h4>معلومات العميل</h4>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">الاسم:</span>
                      <span class="info-value">${order.customerInfo?.name || ''}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">رقم الهاتف:</span>
                      <div class="contact-actions">
                        <a href="tel:${order.customerInfo?.phone || ''}" class="contact-btn call-btn">
                          <i class="fas fa-phone"></i> ${order.customerInfo?.phone || ''}
                        </a>
                        <a href="https://wa.me/${(order.customerInfo?.phone || '').replace(/\D/g, '')}" target="_blank" class="contact-btn whatsapp-btn">
                          <i class="fab fa-whatsapp"></i> واتساب
                        </a>
                      </div>
                    </div>
                    <div class="info-item">
                      <span class="info-label">المحافظة:</span>
                      <span class="info-value">${order.customerInfo?.governorate || ''}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">العنوان:</span>
                      <span class="info-value address-value">${order.customerInfo?.address || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="order-products-section">
                <h4>المنتجات المطلوبة</h4>
                <div class="products-grid">
                  ${productsHTML}
                </div>
              </div>
              
              <div class="order-summary-section">
                <h4>ملخص الطلب</h4>
                <div class="summary-items">
                  <div class="summary-item">
                    <span class="summary-label">إجمالي المنتجات:</span>
                    <span class="summary-value">${formatCurrency(order.orderDetails?.subtotal || 0)}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">الشحن:</span>
                    <span class="summary-value">${formatCurrency(order.orderDetails?.shipping || 0)}</span>
                  </div>
                  <div class="summary-item discount-item ${order.orderDetails?.discount ? '' : 'hidden'}">
                    <span class="summary-label">الخصم:</span>
                    <span class="summary-value">-${order.orderDetails?.discount || 0}%</span>
                  </div>
                  <div class="summary-item total-item">
                    <span class="summary-label">الإجمالي النهائي:</span>
                    <span class="summary-value total-value">${formatCurrency(order.orderDetails?.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div class="order-notes-section">
                <h4>ملاحظات</h4>
                <textarea id="order-notes" class="order-notes" placeholder="إضافة ملاحظات للطلب...">${order.orderInfo?.notes || ''}</textarea>
                <button id="save-notes-btn" class="save-notes-btn" data-order-id="${orderId}">
                  <i class="fas fa-save"></i> حفظ الملاحظات
                </button>
              </div>
            </div>
          </div>
        `;
        
        // Add modal to DOM
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-modal').addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        // Add event listener for status update button
        document.getElementById('update-status-btn').addEventListener('click', (e) => {
          const orderId = e.target.dataset.orderId;
          const newStatus = document.getElementById('status-select').value;
          updateOrderStatus(orderId, newStatus);
        });
        
        // Add event listener for save notes button
        document.getElementById('save-notes-btn').addEventListener('click', (e) => {
          const orderId = e.target.dataset.orderId;
          const notes = document.getElementById('order-notes').value;
          saveOrderNotes(orderId, notes);
        });
        
        // Show modal with animation
        setTimeout(() => {
          modal.classList.add('show');
        }, 10);
      } else {
        // Document doesn't exist
        showNotification('لا يمكن العثور على الطلب', 'error');
      }
    })
    .catch((error) => {
      console.error("Error getting order details: ", error);
      showNotification('حدث خطأ أثناء تحميل تفاصيل الطلب', 'error');
    });
}

// Function to save order notes
function saveOrderNotes(orderId, notes) {
  db.collection('orders').doc(orderId).update({
    'orderInfo.notes': notes,
    'orderInfo.lastUpdate': firebase.firestore.Timestamp.now()
  })
  .then(() => {
    showNotification('تم حفظ الملاحظات بنجاح', 'success');
  })
  .catch((error) => {
    console.error("Error saving notes: ", error);
    showNotification('حدث خطأ أثناء حفظ الملاحظات', 'error');
  });
}

function updateOrderStatus(orderId, newStatus) {
  // Update in Firestore
  db.collection('orders').doc(orderId).update({
    'orderInfo.status': newStatus,
    'orderInfo.lastUpdate': firebase.firestore.Timestamp.now()
  })
  .then(() => {
    // Find the order in the array and update its status
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
      order.orderInfo.status = newStatus;
    }
    
    // Re-render orders and update stats
    renderOrders();
    updateStats();
    
    // Show success notification
    showNotification(`تم تحديث حالة الطلب إلى ${getStatusText(newStatus)}`, 'success');
    
    // Close modal if it exists
    const modal = document.getElementById('order-details-modal');
    if (modal) {
      document.body.removeChild(modal);
    }
  })
  .catch((error) => {
    console.error("Error updating order status: ", error);
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