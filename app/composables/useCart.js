export const useCart = () => {
    const cart = useState('cart', () => []);
    const addToCartButtonStatus = ref('add');
    const removeFromCartButtonStatus = ref('remove');
    const clearCartButtonStatus = ref('clear');
    const {push} = useNotivue();

    const handleAddToCart = productId => {
        addToCartButtonStatus.value = 'loading';

        $fetch('/api/cart/add', {
            method: 'POST',
            body: {productId},
        })
            .then(res => {
                updateCart([...cart.value, res.addToCart.cartItem]);
                addToCartButtonStatus.value = 'added';
                setTimeout(() => (addToCartButtonStatus.value = 'add'), 2000);
            })
            .catch(err => {
                addToCartButtonStatus.value = 'add';
                const errorMessage = err.response.errors[0].message
                    .replace(/<a[^>]*>(.*?)<\/a>/g, '')
                    .replace(/&mdash;/g, '—')
                    .trim();
                push.error(errorMessage);
            });
    };

    const handleRemoveFromCart = key => {
        removeFromCartButtonStatus.value = 'loading';
        $fetch('/api/cart/update', {
            method: 'POST',
            body: {items: [{key, quantity: 0}]},
        }).then(() => {
            removeFromCartButtonStatus.value = 'remove';
            updateCart(cart.value.filter(item => item.key !== key));
        });
    };

    const handleClearCart = async () => {
        clearCartButtonStatus.value = 'loading';
        try {
            await $fetch('/api/cart/clear', {
                method: 'POST',
            });

            updateCart([]);
            clearCartButtonStatus.value = 'cleared';
            push.success('Cart has been cleared successfully.');

            setTimeout(() => (clearCartButtonStatus.value = 'clear'), 2000);
        } catch (error) {
            push.error('Failed to clear the cart.');
            clearCartButtonStatus.value = 'clear';
            console.error('Failed to clear cart:', error);
        }
    };

    const updateCart = newCart => {
        cart.value = newCart;
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    onMounted(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) cart.value = JSON.parse(storedCart);
    });

    return {
        cart,
        handleAddToCart,
        addToCartButtonStatus,
        handleRemoveFromCart,
        removeFromCartButtonStatus,
        handleClearCart,
        clearCartButtonStatus,
    };
};
