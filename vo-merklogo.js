import {LitElement, html} from './assets/@polymer/lit-element/lit-element.js';

/**
 * `vo-merklogo` Het logo van de Vlaamse overheid
 * 
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class VoMerklogo extends LitElement {
	static get properties() {
    	return {
    		/**
    		 * Achtergrondkleur in hex, rgb or rgba.
    		 */
    		kleur: String,
    		/**
    		 * Tekst die naast het logo zal gerenderd worden.
    		 */
    		tekst: String,
    		/**
    		 * Tekst lit-html met een hoofdlijn tekst en bijlijn die bepaald kan worden door de `tekst` property
    		 */
    		_tekst: String
    	};
    }
	
	/**
	 * Rendert het element.
	 * 
	 * @return {TemplateResult}
	 */
    render() {
    	this._changeBackgroundColor();
    	this._computeTekst();
    	
    	return html`
   			<style>
	            :host {
	                display: flex;
	                flex-grow: 0;
	                flex-shrink: 0;
	            }
	            
	            #leeuw {
	                display: block;
	                position: relative; /* nodig voor position:absolute van :after */
	                height: 0;
	                width: 0;
	                flex-grow: 0;
	                flex-shrink: 0;
	                border-style: solid;
	                border-bottom-width: 44px;
	                border-left-width: 29px;
	                border-top-width: 0;
	                border-right-width: 16px;
	                border-color: rgb(228, 228, 228);
	                border-right-color: transparent !important;
	            }
	
	            #leeuw:after {
	                content: '';
	                display: block;
	                position: absolute;
	                right: 2px;
	                top: 9px;
	                height: 27px;
	                width: 17px;
	                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAbCAYAAACa9mScAAAEk0lEQVR42pxV228UVRyendnt3mb2fpm9dtvdtrDixmrSIN4SNfiEJSXBB9MQkWBMJKjhBR8Mf4DwpA8kKglqKBgSrSUkEpsgSIwPoC3strSL3V7YS7d7m73MXmbX76zsppqK6CRnZs6cc77f9/t+l6GoTZfT4XSFHg8dpf7jRbdvNE3ZrLYnfL2+C61ma/h/gfT19u0Mbg/+qFAodtUb9e9kMhlhFWAYhn4UEAYHaZfTdVqtVg/F4/HD+UL+psflOaJRaxx6vb5/I7Nx+99A5AaDQWc0Gg2JRGLvYnTxEjS5iMPPLcWWXne73Edjy7HzTt7Zp9PpDjZxiVUxsnZ/bapcLgtdJj09PQq4MBu9F/1hcHDwpMViOZjL5T5eXVv9jOf548Vi8deKWIl53d5TYMuxWvYF3s7vzGQzU/V6vdkGEUWxJjWkNWhyxmQyvV2tVq+kUql3GlKjoexRvgJWLrD6RigK02az2Qa9ygzN7F9Pr18Eq/W2O7DG+by+L8BotNFonIvMRd7E+4jX43VIknQFlt/SarUMLEdu/XbrODTsGwgMMDJapu9GZ6B/4FO5XD6KA+fvhO+MVyoVcWho6BTmnkQycR2HPLDsJpuhA5XP53+HoQ8EQegKTjdbzf04EA1Hwodz+ZwU8AdOyhn5k4jUVbi6gD0Nu80+sjkapVLpPlh3haVBfQXiXc7msoXgtuAbVqv1PegyCd9/wbpQq9WWVSrV7ofmCRS+ipFUyBVNn8/3bavVKs3Nz+11Op1P1eo1CmABpMEINDmNfVtnLGJ+c2V15ZLX6z0CABasPsGBGCWjXuVt/MsA+Qm69EMX/h+Tjdw4jjOwLLsPryIAvyRpj4PDVbFaSqaSE3CRVSqV2yiBipP9/n7/bpTEM8lk8hymxnZtgIETDzfozkH1eaS8WcfpQvgObcW7WMugFMZJoT6IUtHj9nyI7J4J7Qjd6BQYQ6wXCoV5JBDl4B3PA8AAUaOYV4WCMMnpuHGL2RIkm8HuxvLK8gFENd6iWn9WMQAqGE0MkcwRjT3kmVpPRbCRQraeJa67ne5jyCkKJUQtLC6cRQCGsX6tDYKYL8GVMKz3qlVqGfR5Gu8bAF0j6xCfRPB7lmPH4CrbERQByOSF/HQbpFQuNYql4gQOsbCkhag2gKSwlG1rUCk3UeHHyDraxqGONiajya7n9HvkHVRQn7GarTtwmMGgH0SOjHZypDfSs0j5KZvN9hHcDUlNqcax3D5EydLtXBA1DNonYI2IXCMtF2D2zjrRAS79TIzApVEiJRrYGTStSfmmeohiUKRiodFduPUs+u6LBaHweTe9GSYHIZOR+cgu6HGv+/3v2QdrLZVSVUcCjqEJPQbgC2hKJbKG9B+sS/U4ut3Xf6mdrdIY1Xwbonk0Gs1LaFTD6XR6AuxAQuKsFisPba5vrqMtQeB3C/5eRlHSsH4A0WKy2ew0ki/psDvGUWcnUP0VgNbBuiJ76P9ERlN+v38Uv4/3Z2ZnXkO7SIChCq30K/ScMYA0UagLskf5r8AlB1hUUOE5Mkd0aLTPQ2jq7yJq2/8QYADHfmEQMqqC8gAAAABJRU5ErkJggg==');
	                /* HD image voor retina */
	                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAA2CAMAAACV3rt9AAAAM1BMVEUAAAA6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODo6ODoxn0D5AAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAf1JREFUOMuFlduirCAMQwMiVEVY//+156F4m3H24clxYpumaZH8TIv+c6a9/gdhnb8hoQJ/Jgo7wCQp/oIsAKYorfkHpEOfpbpr7u9xEuxRijCL9QdkD5J2KKo9SDGbmaU7pEdJKxBllEF/aft0QmIZiFVKNEkRUqe1cE+2Ai1I8uILKYVK+RCmTwrS7hIadecm+DQQKlELu3+VbO0nZOrgRbWkDKc0a71nqUFSwRThVHjZjiYfMWInS/2lnx16kGuXpG2QuR9gHnV3Dxq/IU2SMmDesa9278c/rl3gu5UJk0IHkmKQmkd9nLxI22jRKm0Q3vyPl5UJskH/46yDq5E0++Onv8FL3Vzfl3nJwOYymtTow0jNHnmyUzJpO8gkqEvzmHXkKWBSPpVpAHBARpdmKY65cz0vSHXLkiRtJ+HUPiBl/MwDKkm5+bvx2YYbIfRb3aEj/7y6LdbTZfGaeA0S3gUXIjSuATE0yDwozENKF+2Q18MfLOv5ODldhU9Igp4kqfQBEfUJUQNWW05dJLJDymNzcakrlVHqqtt00Raz2rgsMcNl2/ke8mmsG9/yYs+NS/j0MgdH7/MR0n4v4LHhSO8beAfG6r0tw+/LYB8Xh4Xfy95GxL6+R0p9rBvfkZvN36TCNhTxC+ZswPP+shP8C3JdS3P7BbllzRX+AW4mIELSL5qxAAAAAElFTkSuQmCC');
	                background-size: 17px 27px;
	            }
	
	            #tekst {
	                display: flex;
	                align-self: stretch;
	                flex-direction: column;
	                justify-content: flex-start;
	                font-family: "Flanders Art", Calibri, sans-serif;
	            }
	
	            #hoofdlijn {
	                font-size: 15px;
	                line-height: 15px;
	                margin-top: 11px;
	                margin-right: 11px;
	            }
	
	            #bijlijn {
	                font-size: 8px;
	                line-height: 8px;
	                margin-top: -2px;
	                margin-left: 2px;
	            }
	        </style>
	        
	    	<div id="leeuw"></div>
	    	${this._tekst}
    	`;
    }
    
    /**
     * Wijzigt de achtergrondkleur naar de `kleur` als die bepaald is. 
     * 
     * @return {void}
     */
    _changeBackgroundColor() {
    	this.style.backgroundColor = this.kleur;
    }
	
    /**
     * Bepaalt de '_tekst' propertie die gebruikt wordt bij het renderen
     * 
     * @return {void}
     */
	_computeTekst() {
		if (this.tekst) {
    		this._tekst = html`
    			<div id="tekst">
	                <div id="hoofdlijn">Vlaanderen</div>
	                <div id="bijlijn">${this.tekst}</div>
	            </div>
    		`;
    	}
	}
}

customElements.define('vo-merklogo', VoMerklogo);
