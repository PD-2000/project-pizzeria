import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
	initPages(){
		const thisApp = this;

		thisApp.pages = document.querySelector(select.containerOf.pages).children;
		thisApp.navLinks = document.querySelectorAll(select.nav.links);

		const idFromHash = window.location.hash.replace('#/', '');
		let pageMatchingHash = thisApp.pages[0].id;

		for(let page of thisApp.pages){
			if(page.id == idFromHash){
				pageMatchingHash = page.id;
				break;
			}
		}

		thisApp.activatePage(pageMatchingHash);

		for(let link of thisApp.navLinks){
			link.addEventListener('click', function(event){
				event.preventDefault();
				const clickedElement = this;
				
				// get page id from href attribute
				const id = clickedElement.getAttribute('href').replace('#', '');

				// run activatePage with that id
				thisApp.activatePage(id);

				// change URL hash
				window.location.hash = '#/' + id;
			});
		}
	},
	activatePage: function(pageId){
		const thisApp = this;

		// add 'active' class to matching pages, remove from non-matching ones
		for(let page of thisApp.pages)
			page.classList.toggle(classNames.pages.active, page.id == pageId);
		
		// add 'active' class to matching links, remove from non-matching ones
		for(let link of thisApp.navLinks)
			link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
	},
	initBooking(){
		const thisApp = this;

		thisApp.bookingPage = document.querySelector(select.containerOf.booking);
		thisApp.booking = new Booking(thisApp.bookingPage);
	},
	initMenu(){
		const thisApp = this;

		for(let productData in thisApp.data.products){
			new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
		}
	},
	initData: function(){
		const thisApp = this;
		const url = settings.db.url + '/' + settings.db.products;

		thisApp.data = {};

		fetch(url)
			.then(function(rawResponse){
				return rawResponse.json();
			})
			.then(function(parsedResponse){
				thisApp.data.products = parsedResponse;

				thisApp.initMenu();
			});
	},
	initCart: function(){
		const thisApp = this;

		const cartElem = document.querySelector(select.containerOf.cart);
		thisApp.cart = new Cart(cartElem);

		thisApp.productList = document.querySelector(select.containerOf.menu);

		thisApp.productList.addEventListener('add-to-cart', function(event){
			app.cart.add(event.detail.product);
		});
	},
	initHome: function(){
		const thisApp = this;
		const homeElem = document.querySelector(select.containerOf.home);

		thisApp.homeElem = new Home(homeElem, thisApp);
	},
	init: function(){
		const thisApp = this;

		thisApp.initPages();
		thisApp.initData();
		thisApp.initCart();
		thisApp.initBooking();
		thisApp.initHome();
	}
};

app.init();