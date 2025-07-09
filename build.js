/**
 * Minimoria Jewelry Builder Wizard
 * Handles step-by-step product configuration and pricing
 * Preserves user-selected chain material and chain size when pendant material changes
 * Removes is-selected classes from steps 2+ on load and when no chain is selected
 * Updates color add-on display for unavailable pendant types
 * Updates image preview based on pendant type selection
 * Handles engraving as text input
 * Prevents Enter key form submission and validates steps before navigation
 * Fixed engraving text display in summary
 * Added confirmation checkbox functionality for submit blocker
 */

console.log("Hello!");

class JewelryBuilderWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7;
        this.orderData = {
            pendantType: null,
            pendantMaterial: null,
            chainType: null,
            chainSize: null,
            chainMaterial: null,
            addOns: {
                colors: 0,
                diamonds: 0,
                engraving: ''
            }
        };
        
        // Track if user has explicitly chosen chain options
        this.userSelectedChainMaterial = false;
        this.userSelectedChainSize = false;
        
        // Image URLs for pendant types
        this.pendantImages = {
            '3d_enamel': 'https://cdn.prod.website-files.com/682e514b555d6e56ed149a7f/684a78d4f9e4477701534e54_1.avif',
            '2d_enamel': 'https://cdn.prod.website-files.com/682e514b555d6e56ed149a7f/684a7901f486e2d3e851a147_2.avif',
            'halo_sketch': 'https://cdn.prod.website-files.com/682e514b555d6e56ed149a7f/684a792915e8726a89f28f8b_3.avif',
            'solid_sketch': 'https://cdn.prod.website-files.com/682e514b555d6e56ed149a7f/684a791efa3e2ebfe7969a49_4.avif',
            'solid_picture': 'https://cdn.prod.website-files.com/682e514b555d6e56ed149a7f/684a793a48f2f809d15f3ad4_5.avif'
        };
        
        // Pendant pricing data (without chain)
        this.pendantPricing = {
            '3d_enamel': {
                'silver_925_gold_plated': { price: 163, extraColor: 22 },
                'silver_925': { price: 163, extraColor: 22 },
                '10k_yellow_gold': { price: 430, extraColor: 22 },
                '10k_white_gold': { price: 430, extraColor: 22 },
                '14k_yellow_gold': { price: 535, extraColor: 22 },
                '14k_white_gold': { price: 535, extraColor: 22 },
                '18k_yellow_gold': { price: 630, extraColor: 22 },
                '18k_white_gold': { price: 630, extraColor: 22 }
            },
            '2d_enamel': {
                'silver_925_gold_plated': { price: 153, extraColor: 14 },
                'silver_925': { price: 153, extraColor: 14 },
                '10k_yellow_gold': { price: 420, extraColor: 14 },
                '10k_white_gold': { price: 420, extraColor: 14 },
                '14k_yellow_gold': { price: 525, extraColor: 14 },
                '14k_white_gold': { price: 525, extraColor: 14 },
                '18k_yellow_gold': { price: 620, extraColor: 14 },
                '18k_white_gold': { price: 620, extraColor: 14 }
            },
            'solid_sketch': {
                'silver_925_gold_plated': { price: 153, extraColor: 14 },
                'silver_925': { price: 153, extraColor: 14 },
                '10k_yellow_gold': { price: 420, extraColor: 14 },
                '10k_white_gold': { price: 420, extraColor: 14 },
                '14k_yellow_gold': { price: 525, extraColor: 14 },
                '14k_white_gold': { price: 525, extraColor: 14 },
                '18k_yellow_gold': { price: 620, extraColor: 14 },
                '18k_white_gold': { price: 620, extraColor: 14 }
            },
            'halo_sketch': {
                'silver_925_gold_plated': { price: 140, extraColor: 0 },
                'silver_925': { price: 140, extraColor: 0 },
                '10k_yellow_gold': { price: 380, extraColor: 0 },
                '10k_white_gold': { price: 380, extraColor: 0 },
                '14k_yellow_gold': { price: 480, extraColor: 0 },
                '14k_white_gold': { price: 480, extraColor: 0 },
                '18k_yellow_gold': { price: 580, extraColor: 0 },
                '18k_white_gold': { price: 580, extraColor: 0 }
            },
            'solid_picture': {
                'silver_925_gold_plated': { price: 153, extraColor: 0 },
                'silver_925': { price: 153, extraColor: 0 },
                '10k_yellow_gold': { price: 420, extraColor: 0 },
                '10k_white_gold': { price: 420, extraColor: 0 },
                '14k_yellow_gold': { price: 525, extraColor: 0 },
                '14k_white_gold': { price: 525, extraColor: 0 },
                '18k_yellow_gold': { price: 620, extraColor: 0 },
                '18k_white_gold': { price: 620, extraColor: 0 }
            }
        };

        // Chain pricing by material and size (independent of pendant)
        this.chainPricing = {
            '10k_yellow_gold': { 16: 110, 18: 110, 20: 120, 22: 130 },
            '10k_white_gold': { 16: 110, 18: 110, 20: 120, 22: 130 },
            '14k_yellow_gold': { 16: 125, 18: 125, 20: 135, 22: 145 },
            '14k_white_gold': { 16: 125, 18: 125, 20: 135, 22: 145 },
            '18k_yellow_gold': { 16: 140, 18: 140, 20: 150, 22: 160 },
            '18k_white_gold': { 16: 140, 18: 140, 20: 150, 22: 160 },
            'silver_925_gold_plated': { 16: 25, 18: 25, 20: 30, 22: 35 },
            'silver_925': { 16: 25, 18: 25, 20: 30, 22: 35 }
        };

        // Step mapping
        this.stepMapping = {
            1: 'step-pendant-type',
            2: 'step-pendant-material',
            3: 'step-chain-type',
            4: 'step-chain-size',
            5: 'step-chain-material',
            6: 'step-add-ons',
            7: 'step-summary'
        };

        this.init();
    }

    init() {
        this.clearInitialSelections();
        this.initializeColorElements();
        this.setupEventListeners();
        this.preventEnterKeySubmission();
        this.updateStepVisibility();
        this.updatePrice();
        this.updateColorPricing();
        this.initializeSubmitBlocker();
    }

    // Initialize submit blocker - show it by default
    initializeSubmitBlocker() {
        const submitBlocker = document.getElementById('build-submit-blocker');
        if (submitBlocker) {
            submitBlocker.style.display = 'block';
            console.log('Submit blocker initialized - showing by default');
        }
    }

    // Handle confirmation checkbox state
    handleConfirmationCheckbox() {
        const confirmationCheckbox = document.getElementById('summary-confirmation');
        const submitBlocker = document.getElementById('build-submit-blocker');
        
        if (confirmationCheckbox && submitBlocker) {
            if (confirmationCheckbox.checked) {
                // Hide the blocker when checkbox is checked
                submitBlocker.style.display = 'none';
                console.log('Confirmation checked - hiding submit blocker');
            } else {
                // Show the blocker when checkbox is unchecked
                submitBlocker.style.display = 'block';
                console.log('Confirmation unchecked - showing submit blocker');
            }
        }
    }

    // Prevent Enter key from submitting the form
    preventEnterKeySubmission() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key prevented - form submission blocked');
                return false;
            }
        });
        
        // Also prevent form submission if there are any forms
        document.addEventListener('submit', (e) => {
            if (this.currentStep < this.totalSteps) {
                e.preventDefault();
                console.log('Form submission prevented - not on final step');
                return false;
            }
        });
        
        console.log('Enter key prevention and form submission blocking initialized');
    }

    // Validate current step before allowing navigation
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1: // Pendant Type
                if (!this.orderData.pendantType) {
                    alert('Please select a pendant type before continuing.');
                    return false;
                }
                break;
                
            case 2: // Pendant Material
                if (!this.orderData.pendantMaterial) {
                    alert('Please select a pendant material before continuing.');
                    return false;
                }
                break;
                
            case 3: // Chain Type
                if (!this.orderData.chainType) {
                    alert('Please select a chain type before continuing.');
                    return false;
                }
                break;
                
            case 4: // Chain Size (only if chain is selected)
                if (this.orderData.chainType === 'cross_engraved' && !this.orderData.chainSize) {
                    alert('Please select a chain size before continuing.');
                    return false;
                }
                break;
                
            case 5: // Chain Material (only if chain is selected)
                if (this.orderData.chainType === 'cross_engraved' && !this.orderData.chainMaterial) {
                    alert('Please select a chain material before continuing.');
                    return false;
                }
                break;
                
            case 6: // Add-ons (no validation required - all optional)
                // Add-ons are optional, so no validation needed
                break;
                
            default:
                break;
        }
        
        console.log(`Step ${this.currentStep} validation passed`);
        return true;
    }

    // Initialize color elements - hide unavailable element by default
    initializeColorElements() {
        const buildUnavailable = document.getElementById('build-unavailable');
        if (buildUnavailable) {
            buildUnavailable.style.display = 'none';
        }
        
        const colorsSelect = document.getElementById('addons-colors');
        if (colorsSelect) {
            colorsSelect.style.display = 'block';
        }
        
        console.log('Initialized color elements - build-unavailable hidden, addons-colors visible');
    }

    // Update image preview based on pendant type
    updateImagePreview() {
        const imagePreview = document.getElementById('build-image-preview');
        if (imagePreview && this.orderData.pendantType) {
            const imageUrl = this.pendantImages[this.orderData.pendantType];
            if (imageUrl) {
                imagePreview.src = imageUrl;
                console.log(`Updated image preview for ${this.orderData.pendantType}: ${imageUrl}`);
            } else {
                console.log(`No image found for pendant type: ${this.orderData.pendantType}`);
            }
        }
    }

    // Clear is-selected classes from all steps starting from step 2
    clearInitialSelections() {
        // Clear pendant material selections
        const pendantMaterialCards = document.querySelectorAll('#step-pendant-material .build-selector-card');
        pendantMaterialCards.forEach(card => {
            card.classList.remove('is-selected');
        });

        // Clear chain type selections
        const chainTypeCards = document.querySelectorAll('#step-chain-type .build-selector-card');
        chainTypeCards.forEach(card => {
            card.classList.remove('is-selected');
        });

        // Clear chain size selections
        const chainSizeCards = document.querySelectorAll('#step-chain-size .build-selector-card');
        chainSizeCards.forEach(card => {
            card.classList.remove('is-selected');
        });

        // Clear chain material selections
        const chainMaterialCards = document.querySelectorAll('#step-chain-material .build-selector-card');
        chainMaterialCards.forEach(card => {
            card.classList.remove('is-selected');
        });

        // Clear add-ons selections
        const addOnsCards = document.querySelectorAll('#step-add-ons .build-selector-card');
        addOnsCards.forEach(card => {
            card.classList.remove('is-selected');
        });

        console.log('Cleared initial is-selected classes from steps 2+');
    }

    // Helper function to get text from selected radio button
    txt(selector) {
        const selectedRadio = document.querySelector(`${selector}:checked`);
        if (selectedRadio) {
            const label = selectedRadio.closest('label');
            if (label) {
                const labelText = label.querySelector('.build-material-selector-label, .w-form-label');
                return labelText ? labelText.textContent.trim() : selectedRadio.value;
            }
        }
        return '-';
    }

    setupEventListeners() {
        // Set up all possible navigation buttons
        const navigationButtons = [
            { id: 'type-next', action: 'next' },
            { id: 'material-prev', action: 'prev' },
            { id: 'material-next', action: 'next' },
            { id: 'chain-type-prev', action: 'prev' },
            { id: 'chain-type-next', action: 'next' },
            { id: 'chain-size-prev', action: 'prev' },
            { id: 'chain-size-next', action: 'next' },
            { id: 'chain-material-prev', action: 'prev' },
            { id: 'chain-material-next', action: 'next' },
            { id: 'add-ons-prev', action: 'prev' },
            { id: 'addons-prev', action: 'prev' },
            { id: 'add-ons-next', action: 'next' },
            { id: 'addons-next', action: 'next' },
            { id: 'summary-prev', action: 'prev' }
        ];

        navigationButtons.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (button.action === 'next') {
                        this.nextStep();
                    } else {
                        this.previousStep();
                    }
                });
            }
        });

        // Radio button changes - use event delegation for better reliability
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                console.log('Radio changed:', e.target.name, '=', e.target.value);
                this.handleRadioChange(e.target);
            }
        });

        // Confirmation checkbox event listener
        const confirmationCheckbox = document.getElementById('summary-confirmation');
        if (confirmationCheckbox) {
            confirmationCheckbox.addEventListener('change', () => {
                this.handleConfirmationCheckbox();
            });
            console.log('Confirmation checkbox event listener set up');
        }

        // Add-on controls
        this.setupAddOnControls();
    }

    setupAddOnControls() {
        // Colors select field
        const colorsSelect = document.querySelector('select[name="colors"], #addons-colors');
        if (colorsSelect) {
            colorsSelect.addEventListener('change', () => {
                this.orderData.addOns.colors = parseInt(colorsSelect.value) || 0;
                this.updatePrice();
            });
        }

        // Diamonds select field
        const diamondsSelect = document.querySelector('select[name="diamonds"], #addons-diamonds');
        if (diamondsSelect) {
            diamondsSelect.addEventListener('change', () => {
                this.orderData.addOns.diamonds = parseInt(diamondsSelect.value) || 0;
                this.updatePrice();
            });
        }

        // Engraving text input - use multiple selectors and event types
        const engravingSelectors = [
            'input[name="engraving"]',
            '#addons-engraving',
            'input[id="addons-engraving"]'
        ];
        
        engravingSelectors.forEach(selector => {
            const engravingInput = document.querySelector(selector);
            if (engravingInput) {
                // Listen to both input and keyup events for better reliability
                ['input', 'keyup', 'change'].forEach(eventType => {
                    engravingInput.addEventListener(eventType, () => {
                        this.orderData.addOns.engraving = engravingInput.value.trim();
                        console.log('Engraving text updated:', this.orderData.addOns.engraving);
                    });
                });
                console.log(`Set up engraving event listeners for: ${selector}`);
            }
        });
    }

    // Update color pricing text based on pendant type
    updateColorPricing() {
        const priceColorsElement = document.getElementById('price-colors');
        if (priceColorsElement && this.orderData.pendantType && this.orderData.pendantMaterial) {
            const pendantPricing = this.pendantPricing[this.orderData.pendantType];
            if (pendantPricing) {
                const materialPricing = pendantPricing[this.orderData.pendantMaterial];
                if (materialPricing) {
                    if (materialPricing.extraColor > 0) {
                        priceColorsElement.textContent = `2 colors included, then $${materialPricing.extraColor}`;
                    } else {
                        priceColorsElement.textContent = 'unavailable';
                    }
                }
            }
        }
    }

    // Update colors select field based on pendant type
    updateColorsSelect() {
        const colorsSelect = document.getElementById('addons-colors');
        const buildUnavailable = document.getElementById('build-unavailable');
        
        if (colorsSelect && buildUnavailable) {
            const isColorAvailable = this.orderData.pendantType && 
                                   this.orderData.pendantType !== 'halo_sketch' && 
                                   this.orderData.pendantType !== 'solid_picture';
            
            if (isColorAvailable) {
                // Show select element, hide unavailable element
                colorsSelect.style.display = 'block';
                buildUnavailable.style.display = 'none';
                console.log('Colors available - showing select, hiding unavailable');
            } else {
                // Hide select element, show unavailable element
                colorsSelect.style.display = 'none';
                buildUnavailable.style.display = 'block';
                
                // Reset colors count
                this.orderData.addOns.colors = 0;
                console.log('Colors unavailable - hiding select, showing unavailable');
            }
        }
    }

    // Clear all chain selections (both data and UI)
    clearChainSelections() {
        // Clear data
        this.orderData.chainSize = null;
        this.orderData.chainMaterial = null;
        
        // Reset the flags since chain options are cleared
        this.userSelectedChainMaterial = false;
        this.userSelectedChainSize = false;
        
        // Clear UI - uncheck all chain size radio buttons and remove is-selected class
        const chainSizeRadios = document.querySelectorAll('input[name="chain-size"]');
        chainSizeRadios.forEach(radio => {
            radio.checked = false;
            const parentCard = radio.closest('.build-selector-card');
            if (parentCard) {
                parentCard.classList.remove('is-selected');
            }
        });
        
        // Clear UI - uncheck all chain material radio buttons and remove is-selected class
        const chainMaterialRadios = document.querySelectorAll('input[name="chain-material"]');
        chainMaterialRadios.forEach(radio => {
            radio.checked = false;
            const parentCard = radio.closest('.build-selector-card');
            if (parentCard) {
                parentCard.classList.remove('is-selected');
            }
        });
        
        console.log('Cleared all chain selections and removed is-selected classes');
    }

    // Set default chain selections based on pendant material
    setDefaultChainSelections() {
        // Set defaults: Cross Engraved, 16", same material as pendant (only if not user-selected)
        this.orderData.chainType = 'cross_engraved';
        
        // Only set chain size to default if user hasn't explicitly chosen one
        if (!this.userSelectedChainSize) {
            this.orderData.chainSize = '16';
        }
        
        // Only set chain material to match pendant if user hasn't explicitly chosen one
        if (!this.userSelectedChainMaterial) {
            this.orderData.chainMaterial = this.orderData.pendantMaterial;
        }
        
        // Update UI to reflect these defaults and trigger proper events
        this.selectRadioAndTriggerEvent('chain-type', 'chain_type_cross_engraved');
        
        // Only update chain size UI if user hasn't explicitly chosen one
        if (!this.userSelectedChainSize) {
            this.selectRadioAndTriggerEvent('chain-size', '16_inches');
        }
        
        // Only update chain material UI if user hasn't explicitly chosen one
        if (!this.userSelectedChainMaterial) {
            this.selectRadioAndTriggerEvent('chain-material', this.getWebflowChainMaterialValue(this.orderData.chainMaterial));
        }
        
        console.log('Set default chain selections:', {
            chainType: this.orderData.chainType,
            chainSize: this.orderData.chainSize,
            chainMaterial: this.orderData.chainMaterial,
            userSelectedChainSize: this.userSelectedChainSize,
            userSelectedChainMaterial: this.userSelectedChainMaterial
        });
    }

    // Restore chain selections when switching back to Cross Engraved
    restoreChainSelections() {
        // If chain size is null, restore default
        if (!this.orderData.chainSize) {
            this.orderData.chainSize = '16';
            this.selectRadioAndTriggerEvent('chain-size', '16_inches');
            // Reset flag since we're restoring defaults
            this.userSelectedChainSize = false;
        }
        
        // If chain material is null, restore default
        if (!this.orderData.chainMaterial) {
            this.orderData.chainMaterial = this.orderData.pendantMaterial;
            this.selectRadioAndTriggerEvent('chain-material', this.getWebflowChainMaterialValue(this.orderData.chainMaterial));
            // Reset flag since we're restoring defaults
            this.userSelectedChainMaterial = false;
        }
        
        console.log('Restored chain selections:', {
            chainSize: this.orderData.chainSize,
            chainMaterial: this.orderData.chainMaterial,
            userSelectedChainSize: this.userSelectedChainSize,
            userSelectedChainMaterial: this.userSelectedChainMaterial
        });
    }

    // Helper to select radio button, update UI, and trigger proper events
    selectRadioAndTriggerEvent(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            // IMPORTANT: Actually check the radio input HTML tag
            radio.checked = true;
            
            // Update visual selection
            this.updateVisualSelection(radio);
            
            // Manually trigger the change event to ensure proper handling
            const changeEvent = new Event('change', { bubbles: true });
            radio.dispatchEvent(changeEvent);
            
            console.log(`Selected radio input and triggered event: ${name} = ${value}, checked = ${radio.checked}`);
        } else {
            console.log(`Radio not found: ${name} = ${value}`);
        }
    }

    // Update visual selection for radio button
    updateVisualSelection(radio) {
        const parentCard = radio.closest('.build-selector-card');
        if (parentCard) {
            // Remove selection from all cards in the same group
            parentCard.parentElement.querySelectorAll('.build-selector-card').forEach(card => {
                card.classList.remove('is-selected');
            });
            // Add selection to current card
            parentCard.classList.add('is-selected');
        }
    }

    // Convert internal material values to Webflow chain material values
    getWebflowChainMaterialValue(internalValue) {
        const reverseMap = {
            '18k_yellow_gold': 'chain_gold_yellow_18k',
            '14k_yellow_gold': 'chain_gold_yellow_14k',
            '10k_yellow_gold': 'chain_gold_yellow_10k',
            '18k_white_gold': 'chain_gold_white_18k',
            '14k_white_gold': 'chain_gold_white_14k',
            '10k_white_gold': 'chain_gold_white_10k',
            'silver_925': 'chain_silver_white_gold_plated',
            'silver_925_gold_plated': 'chain_silver_yellow_gold_plated'
        };
        return reverseMap[internalValue] || internalValue;
    }

    handleRadioChange(radio) {
        const name = radio.name;
        const value = radio.value;

        console.log(`Handling radio change: ${name} = ${value}, checked = ${radio.checked}`);

        // Update order data based on the radio button name
        switch (name) {
            case 'pendant-type':
                this.orderData.pendantType = value;
                this.updateColorPricing();
                this.updateColorsSelect();
                this.updateImagePreview();
                break;
            case 'pendant-material':
                this.orderData.pendantMaterial = this.convertMaterialValue(value);
                console.log('Pendant material set to:', this.orderData.pendantMaterial);
                // Automatically set default chain selections (preserving user-selected options)
                this.setDefaultChainSelections();
                this.updateColorPricing();
                this.updateColorsSelect();
                break;
            case 'chain-type':
                this.orderData.chainType = this.convertChainTypeValue(value);
                console.log('Chain type set to:', this.orderData.chainType);
                if (this.orderData.chainType === 'no_chain') {
                    // Clear chain selections when no chain is selected
                    this.clearChainSelections();
                } else if (this.orderData.chainType === 'cross_engraved') {
                    // Restore chain selections when switching back to cross engraved
                    this.restoreChainSelections();
                }
                break;
            case 'chain-size':
                // Convert HTML value to internal value (16_inches -> 16)
                this.orderData.chainSize = this.convertChainSizeValue(value);
                // Mark that user has explicitly selected chain size
                this.userSelectedChainSize = true;
                console.log('Chain size set to:', this.orderData.chainSize, '(user selected)');
                break;
            case 'chain-material':
                this.orderData.chainMaterial = this.convertChainMaterialValue(value);
                // Mark that user has explicitly selected chain material
                this.userSelectedChainMaterial = true;
                console.log('Chain material set to:', this.orderData.chainMaterial, '(user selected)');
                break;
        }

        // Update visual selection
        this.updateVisualSelection(radio);

        // Always update price after any change
        this.updatePrice();
        this.updateAddOnsVisibility();
    }

    // Convert Webflow pendant material values to pricing data keys
    convertMaterialValue(webflowValue) {
        const materialMap = {
            'pendant_gold_yellow_18k': '18k_yellow_gold',
            'pendant_gold_yellow_14k': '14k_yellow_gold',
            'pendant_gold_yellow_10k': '10k_yellow_gold',
            'pendant_gold_white_18k': '18k_white_gold',
            'pendant_gold_white_14k': '14k_white_gold',
            'pendant_gold_white_10k': '10k_white_gold',
            'pendant_silver_white_gold_plated': 'silver_925',
            'pendant_silver_yellow_gold_plated': 'silver_925_gold_plated'
        };
        return materialMap[webflowValue] || webflowValue;
    }

    // Convert Webflow chain material values to pricing data keys
    convertChainMaterialValue(webflowValue) {
        const materialMap = {
            'chain_gold_yellow_18k': '18k_yellow_gold',
            'chain_gold_yellow_14k': '14k_yellow_gold',
            'chain_gold_yellow_10k': '10k_yellow_gold',
            'chain_gold_white_18k': '18k_white_gold',
            'chain_gold_white_14k': '14k_white_gold',
            'chain_gold_white_10k': '10k_white_gold',
            'chain_silver_white_gold_plated': 'silver_925',
            'chain_silver_yellow_gold_plated': 'silver_925_gold_plated'
        };
        return materialMap[webflowValue] || webflowValue;
    }

    // Convert Webflow chain size values to internal values
    convertChainSizeValue(webflowValue) {
        const sizeMap = {
            '16_inches': '16',
            '18_inches': '18',
            '20_inches': '20',
            '22_inches': '22'
        };
        return sizeMap[webflowValue] || webflowValue;
    }

    // Convert Webflow chain type values
    convertChainTypeValue(webflowValue) {
        const chainTypeMap = {
            'chain_type_cross_engraved': 'cross_engraved',
            'chain_type_none': 'no_chain'
        };
        return chainTypeMap[webflowValue] || webflowValue;
    }

    nextStep() {
        // Validate current step before proceeding
        if (!this.validateCurrentStep()) {
            return; // Stop navigation if validation fails
        }
        
        if (this.currentStep < this.totalSteps) {
            if (this.currentStep === 3 && this.orderData.chainType === 'no_chain') {
                this.currentStep = 6;
            } else {
                this.currentStep++;
            }
            this.updateStepVisibility();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            if (this.currentStep === 6 && this.orderData.chainType === 'no_chain') {
                this.currentStep = 3;
            } else if (this.currentStep === 7 && this.orderData.chainType === 'no_chain') {
                this.currentStep = 6;
            } else {
                this.currentStep--;
            }
            this.updateStepVisibility();
        }
    }

    updateStepVisibility() {
        // Hide all steps
        Object.values(this.stepMapping).forEach(stepId => {
            const step = document.getElementById(stepId);
            if (step) {
                step.style.display = 'none';
            }
        });

        // Show current step
        const currentStepId = this.stepMapping[this.currentStep];
        const currentStepElement = document.getElementById(currentStepId);
        if (currentStepElement) {
            currentStepElement.style.display = 'flex';
        }

        this.updateAddOnsVisibility();
        
        if (this.currentStep === 7) {
            this.updateSummary();
        }

        console.log(`Current step: ${this.currentStep}, Showing: ${currentStepId}`);
    }

    updateAddOnsVisibility() {
        if (this.currentStep === 6) {
            const colorsSection = document.querySelector('[data-addon-section="colors"]');
            
            if (colorsSection) {
                if (this.orderData.pendantType === 'halo_sketch' || this.orderData.pendantType === 'solid_picture') {
                    colorsSection.style.display = 'none';
                } else {
                    colorsSection.style.display = 'block';
                }
            }
        }
    }

    calculatePrice() {
        let totalPrice = 0;
        let pendantPrice = 0;
        let chainPrice = 0;
        let addOnPrice = 0;

        // Get pendant price
        if (this.orderData.pendantType && this.orderData.pendantMaterial) {
            const pendantPricing = this.pendantPricing[this.orderData.pendantType];
            if (pendantPricing) {
                const materialPricing = pendantPricing[this.orderData.pendantMaterial];
                if (materialPricing) {
                    pendantPrice = materialPricing.price;
                    totalPrice += pendantPrice;
                    
                    // Add extra colors pricing (from 3rd color onwards)
                    if (this.orderData.addOns.colors > 2) {
                        const extraColors = this.orderData.addOns.colors - 2;
                        const colorPrice = extraColors * materialPricing.extraColor;
                        addOnPrice += colorPrice;
                        totalPrice += colorPrice;
                    }
                }
            }
        }

        // Add chain price (independent of pendant material)
        if (this.orderData.chainType === 'cross_engraved' && this.orderData.chainMaterial && this.orderData.chainSize) {
            const chainPriceValue = this.chainPricing[this.orderData.chainMaterial]?.[parseInt(this.orderData.chainSize)];
            if (chainPriceValue !== undefined) {
                chainPrice = chainPriceValue;
                totalPrice += chainPrice;
            }
        }

        // Add diamonds pricing
        const diamondPrice = this.orderData.addOns.diamonds * 25;
        addOnPrice += diamondPrice;
        totalPrice += diamondPrice;

        console.log('Detailed price calculation:', {
            pendant: `${this.orderData.pendantType} in ${this.orderData.pendantMaterial}`,
            pendantPrice: pendantPrice,
            chain: `${this.orderData.chainType} ${this.orderData.chainMaterial} ${this.orderData.chainSize}"`,
            chainPrice: chainPrice,
            colors: this.orderData.addOns.colors,
            diamonds: this.orderData.addOns.diamonds,
            addOnPrice: addOnPrice,
            totalPrice: totalPrice
        });

        return totalPrice;
    }

    updatePrice() {
        const price = this.calculatePrice();
        const priceElement = document.getElementById('price');
        if (priceElement) {
            priceElement.textContent = `$${price}`;
        }
    }

    updateSummary() {
        const summaryElement = document.getElementById("build-summary");
        if (summaryElement) {
            const col = this.orderData.addOns.colors;
            const dia = this.orderData.addOns.diamonds;
            
            // Get engraving text directly from the input field as fallback
            const engravingInput = document.getElementById('addons-engraving');
            let engravingText = this.orderData.addOns.engraving;
            
            // If orderData doesn't have the text, try to get it from the input field
            if (!engravingText && engravingInput) {
                engravingText = engravingInput.value.trim();
                // Update orderData with the current input value
                this.orderData.addOns.engraving = engravingText;
            }
            
            // Use "-" if still empty
            engravingText = engravingText || '-';
            
            console.log('Summary engraving text:', engravingText, 'from orderData:', this.orderData.addOns.engraving);
            
            summaryElement.innerHTML = `
                <strong>Pendant Type:</strong> ${this.txt('input[name="pendant-type"]')}<br>
                <strong>Pendant Material:</strong> ${this.txt('input[name="pendant-material"]')}<br>
                <strong>Chain Type:</strong> ${this.txt('input[name="chain-type"]')}<br>
                <strong>Chain Size:</strong> ${this.txt('input[name="chain-size"]')}<br>
                <strong>Chain Material:</strong> ${this.txt('input[name="chain-material"]')}<br>
                <strong>Add-ons:</strong> ${col} colours, ${dia} diamonds<br>
                <strong>Engraving:</strong> ${engravingText}
            `;
        }
    }

    // Generate Stripe-compatible order data
    getStripeOrderData() {
         const price = this.calculatePrice();

    const imgUrl = document.getElementById('build-image-preview')?.src || "";

    return {
      pricing: price * 100,
      currency: "usd",
      quantity: 1,
      images:[imgUrl],
      product: {
          title: this.generateOrderDescription(),
      metadata: {
        pendant_type: this.orderData.pendantType,
        pendant_material: this.orderData.pendantMaterial,
        chain_type: this.orderData.chainType,
        chain_size: this.orderData.chainSize || "none",
        chain_material: this.orderData.chainMaterial || "none",
        colors_count: this.orderData.addOns.colors,
        diamonds_count: this.orderData.addOns.diamonds,
        engraving_text: this.orderData.addOns.engraving || ""
        
      },},
      succsess_url: "https://minimoria.webflow.io/build/success",
	  cancel_url: "https://minimoria.webflow.io/build/error"
    
    };
    }

    generateOrderDescription() {
        let description = `${this.formatLabel(this.orderData.pendantType)} pendant in ${this.formatLabel(this.orderData.pendantMaterial)}`;
        
        if (this.orderData.chainType === 'cross_engraved') {
            description += ` with ${this.formatLabel(this.orderData.chainMaterial)} chain (${this.orderData.chainSize}")`;
        }
        
        if (this.orderData.addOns.colors > 0) {
            description += `, ${this.orderData.addOns.colors} colors`;
        }
        
        if (this.orderData.addOns.diamonds > 0) {
            description += `, ${this.orderData.addOns.diamonds} diamonds`;
        }
        
        if (this.orderData.addOns.engraving) {
            description += `, engraved with "${this.orderData.addOns.engraving}"`;
        }
        
        return description;
    }

    formatLabel(value) {
        if (!value) return '';
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    submitOrder() {
        const orderData = this.getStripeOrderData();
        console.log('Order data for Stripe:', orderData);
        return orderData;
    }
}

// Initialize the wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.jewelryWizard = new JewelryBuilderWizard();
});

// Intercept Form submit
document.addEventListener("submit", function (e) {

  e.preventDefault();

  document.getElementById("build-submit-blocker").style = "display: block;";

  const form = e.target;

  console.log("Form before change data", form);

  const formatedData = window.jewelryWizard.getStripeOrderData();

  fetch(form.action, {
    method: form.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json", // Optional: indicates client accepts JSON response
    },
    body: JSON.stringify(formatedData),
  })
    .then(function (response) {
      console.log("returned n8n response", response);

      return response.json();
    })
    .then(function (data) {
      console.log("returned n8n json data", data);

      if (data?.payment_link) {
        console.log("vai fazer o redirect para: ", data.payment_link);
        window.location.href = data.payment_link;
      }else{
        alert('Problem to order proccess. Reload and try again. ');
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert('Problem to order proccess. Reload and try again. ');
    })
    .finally(function () {
      console.log("fetch finally block executed");
      document.getElementById("build-submit-blocker").style = "";
    });

});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JewelryBuilderWizard;
}
