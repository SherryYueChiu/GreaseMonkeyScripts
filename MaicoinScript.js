/** contains bid price and offer price elements */
let $realtimePrices = document.querySelectorAll(".r-1tchu24.r-qwp1k9.r-q4m81j");
/** contains sell and buy button */
let $buySellBtns = document.querySelectorAll(".r-1awozwy.r-1plom04.r-z2wwpe.r-1loqt21.r-1777fci.r-1otgn73.r-1i6wzkk.r-lrvibr");

let $sideBar = document.querySelector(".r-1rnoaur.r-12kfsgm");
let $mainArea = $sideBar.nextSibling;

let coinTypeCount = document.querySelectorAll(".r-qklmqi.r-ve2vwf.r-1phboty.r-b5h31w.r-48uvzr").length
// coin name by index
document.querySelectorAll(".r-qklmqi.r-ve2vwf.r-1phboty.r-b5h31w.r-48uvzr")[0].firstChild.children[1].textContent;
// coin avg price by index
document.querySelectorAll(".r-qklmqi.r-ve2vwf.r-1phboty.r-b5h31w.r-48uvzr")[0].children[1].firstChild.firstChild.children[1].textContent
let getRealtimeBidPrice = () => {
return viewPrice2Number(realtimePrices[0].innerText);
}

let getRealtimeOfferPrice = () => {
return viewPrice2Number(realtimePrices[1].innerText);
}

let viewPrice2Number = (viewPrice) => {
	return parseInt(viewPrice).replace(/\D/g, '');
}


// TODO: track value change