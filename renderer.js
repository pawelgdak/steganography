$('input[type=range]').on('input', function () {
    $(this).trigger('change');
});

$(".bit_range").change(function() {
    let value = $(this).val();

    $(`.${$(this).attr("name")}_display`).text(value);
})