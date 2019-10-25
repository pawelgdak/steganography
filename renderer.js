$('input[type=range]').on('input', function () {
    $(this).trigger('change');
});

$(".bit_range").change(function() {
    let value = $(this).val();

    $(`.${$(this).attr("name")}_display`).text(value);

    updateTotalBits();
    updateCharactersLeft();
})

$("#text").on("input", () => {    
    updateCharactersLeft();
});

let updateTotalBits = () => {
    const r = parseInt($("#bit_R").val());
    const g = parseInt($("#bit_G").val());
    const b = parseInt($("#bit_B").val());

    $("#bits-total").text(r + g + b);
}

let updateCharactersLeft = () => {

    const pixels = parseInt($("#pixels-total").text());

    const rNumberOfBits = parseInt(document.getElementById("bit_R").value);
    const gNumberOfBits = parseInt(document.getElementById("bit_G").value);
    const bNumberOfBits = parseInt(document.getElementById("bit_B").value);

    const charactersTotal = pixels / (8 / (rNumberOfBits + gNumberOfBits + bNumberOfBits));
    const textLength = document.getElementById("text").value.length;

    console.log()
    
    const charactersLeft = Math.floor(charactersTotal - textLength);

    document.getElementById("characters-left").innerText = charactersLeft;

}