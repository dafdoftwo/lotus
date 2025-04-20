/**
 * Remove Duplicate Form
 * ====================
 * This script removes the duplicate order form that appears above the main registration form.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checking for duplicate forms...');
    
    // Direct removal of the specific form shown in the screenshot
    // This is a very targeted approach that looks for the exact form in the image
    const specificFormRemoval = function() {
        // Look for a form with title "إتمام الطلب" and has fields for customer data
        const formContainers = document.querySelectorAll('[class*="order"], [class*="checkout"], [class*="modal"], [class*="popup"], [id*="order"], [id*="checkout"], div, section');
        
        for (const container of formContainers) {
            // Check if this is the form from the screenshot
            const hasTitleText = container.textContent.includes('إتمام الطلب');
            const hasCustomerDataText = container.textContent.includes('بيانات العميل');
            const hasNameField = container.querySelector('input[placeholder*="الاسم"]');
            const hasPhoneField = container.querySelector('input[placeholder*="الهاتف"]');
            const hasAddressField = container.querySelector('textarea[placeholder*="العنوان"], input[placeholder*="العنوان"]');
            const hasGovernorateDropdown = container.querySelector('select[class*="محافظة"], [class*="dropdown"]');
            const hasCloseButton = container.querySelector('.close, [class*="close"], button[aria-label="Close"]');
            
            // If it has all of these elements, it's likely the duplicate form
            if (hasTitleText && hasCustomerDataText && hasNameField && hasPhoneField) {
                console.log('Found duplicate form that matches screenshot');
                
                // Try to find the modal/popup container
                const modalContainer = findModalContainer(container);
                if (modalContainer) {
                    console.log('Removing duplicate form modal container');
                    modalContainer.remove();
                    
                    // Remove any backdrop/overlay elements
                    document.querySelectorAll('.modal-backdrop, .overlay, .backdrop, [class*="overlay"]').forEach(el => el.remove());
                } else {
                    console.log('Removing duplicate form directly');
                    container.remove();
                }
                
                // Reset body styles
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                
                return true; // Form was found and removed
            }
        }
        
        return false; // Form was not found
    };
    
    // Function to find the modal container for a form
    const findModalContainer = function(element) {
        // Try to find closest modal/popup container
        let current = element;
        
        // Check if the element itself is a modal/popup
        if (isModalOrPopup(current)) {
            return current;
        }
        
        // Check up to 5 parent levels to find a modal/popup container
        for (let i = 0; i < 5; i++) {
            const parent = current.parentElement;
            if (!parent) break;
            
            if (isModalOrPopup(parent)) {
                return parent;
            }
            
            current = parent;
        }
        
        return null;
    };
    
    // Function to check if an element is a modal/popup
    const isModalOrPopup = function(element) {
        // Check class names
        const hasModalClass = 
            element.classList.contains('modal') || 
            element.classList.contains('popup') ||
            /modal|popup|overlay|lightbox|dialog/i.test(element.className);
        
        // Check ID
        const hasModalId = 
            /modal|popup|overlay|lightbox|dialog/i.test(element.id);
        
        // Check style (fixed positioning is common for modals)
        const style = window.getComputedStyle(element);
        const hasModalStyle = 
            style.position === 'fixed' || 
            style.zIndex >= 1000 ||
            style.display === 'flex' && style.alignItems === 'center' && style.justifyContent === 'center';
        
        return hasModalClass || hasModalId || hasModalStyle;
    };
    
    // Try the specific targeted approach first
    if (!specificFormRemoval()) {
        console.log('Specific form not found, trying generic approaches');
        
        // Look for forms with "إتمام الطلب" (Order Completion) header
        const orderForms = document.querySelectorAll('.order-form, form[id*="order"], div[id*="order-form"]');
        let mainForm = null;
        let duplicateForms = [];
        
        // Find all forms that match the pattern
        orderForms.forEach(form => {
            // Check if this form has customer data fields
            const hasNameField = form.querySelector('input[name*="name"], input[placeholder*="الاسم"]');
            const hasPhoneField = form.querySelector('input[name*="phone"], input[placeholder*="الهاتف"]');
            const hasAddressField = form.querySelector('input[name*="address"], textarea[name*="address"], input[placeholder*="العنوان"], textarea[placeholder*="العنوان"]');
            
            // If the form has these fields, it's likely a checkout/order form
            if (hasNameField && hasPhoneField && hasAddressField) {
                // Check if it's a popup or fixed position form (likely the duplicate)
                const isFixedOrPopup = 
                    window.getComputedStyle(form).position === 'fixed' || 
                    form.closest('.modal, .popup, [class*="popup"], [class*="modal"], [style*="position: fixed"]');
                
                // Keep track of all matching forms
                if (isFixedOrPopup) {
                    duplicateForms.push(form);
                } else {
                    // The main form is usually in the normal document flow
                    mainForm = form;
                }
            }
        });
        
        // If we have duplicate forms and a main form, remove the duplicates
        if (mainForm && duplicateForms.length > 0) {
            console.log(`Found ${duplicateForms.length} duplicate forms to remove`);
            duplicateForms.forEach(form => {
                // Also try to remove any parent modal/popup that contains this form
                const possibleContainer = form.closest('.modal, .popup, [class*="popup"], [class*="modal"], [id*="popup"], [id*="modal"]');
                if (possibleContainer) {
                    console.log('Removing duplicate form container');
                    possibleContainer.remove();
                } else {
                    console.log('Removing duplicate form');
                    form.remove();
                }
            });
        } else {
            // Look for the specific form with إتمام الطلب header
            const possibleDuplicateContainers = document.querySelectorAll('div, section');
            
            for (let container of possibleDuplicateContainers) {
                // Check if this container has the completion text and form fields
                const hasCompletionText = container.innerText.includes('إتمام الطلب');
                const hasCustomerInfoText = container.innerText.includes('بيانات العميل');
                const hasInputFields = container.querySelectorAll('input, textarea, select').length > 0;
                
                // If all conditions match, this is likely the duplicate form
                if (hasCompletionText && hasCustomerInfoText && hasInputFields) {
                    console.log('Found duplicate form by text content');
                    
                    // Check if this is a modal/popup
                    const isModal = 
                        container.classList.contains('modal') || 
                        container.classList.contains('popup') || 
                        container.id.includes('modal') || 
                        container.id.includes('popup') ||
                        window.getComputedStyle(container).position === 'fixed';
                    
                    if (isModal) {
                        // Remove the entire modal/popup
                        console.log('Removing duplicate form container');
                        container.remove();
                        
                        // Also remove any backdrop/overlay
                        const backdrop = document.querySelector('.modal-backdrop, .overlay, .backdrop');
                        if (backdrop) backdrop.remove();
                        
                        break;
                    }
                }
            }
        }
    }
    
    // Fix any body styles that may have been set by the modal
    if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    
    console.log('Duplicate form check complete');
}); 