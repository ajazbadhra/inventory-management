$(document).ready(function () {
  var product_data = [];
  var supplier_state;
  var profile_state;
  $.ajax({
    method: "get",
    dataType: "json",
    url: "/product/getProduct",
    success: (data) => {
      product_data = data.product;
    },
  });

  $(".supplier").change(function () {
    var name = $(".supplier").val();
    $.ajax({
      method: "post",
      dataType: "json",
      url: "/purchase/getState",
      data: { sname: name },
      success: (data) => {
        supplier_state = data.supplier_state.state;
        profile_state = data.profile_state[0].state;
      },
    });
  });

  const calculate = (id) => {
    var rate = $("#rate" + id).val();
    var qty = $("#qty" + id).val();
    var gstp = $("#gstp" + id).val();

    var tot = (parseFloat(rate) * parseFloat(qty)).toFixed(3);
    var gstamt = (tot * gstp) / 100;
    $("#gstamt" + id).val(gstamt);
    $("#tot" + id).val(tot);

    var sum = 0;
    $("tr")
      .find(".tot")
      .each(function () {
        if (!isNaN(this.value) && this.value.length != 0) {
          sum += parseFloat(this.value);
        }
      });
    $("#total").val(sum);

    if (supplier_state == profile_state) {
      var gstsum = 0;
      $("tr")
        .find(".gstamt")
        .each(function () {
          if (!isNaN(this.value) && this.value.length != 0) {
            gstsum = (parseFloat(this.value) + parseFloat(gstsum)).toFixed(3);
          }
        });
      var cgst = gstsum / 2;
      $("#cgst").val(cgst);
      $("#sgst").val(cgst);
    } else {
      var gstsum = 0;
      $("tr")
        .find(".gstamt")
        .each(function () {
          if (!isNaN(this.value) && this.value.length != 0) {
            gstsum = (parseFloat(this.value) + parseFloat(gstsum)).toFixed(3);
          }
        });
      $("#igst").val(gstsum);
    }

    $("#roff").keyup(function () {
      var gsts = 0;
      $("tr")
        .find(".gstamt")
        .each(function () {
          if (!isNaN(this.value) && this.value.length != 0) {
            gsts += parseFloat(this.value);
          }
        });
      var roff = $("#roff").val();
      var total = $("#total").val();
      var gt = parseFloat(total) + gsts;
      var gtot = gt - parseFloat(roff);
      $("#gtot").val(gtot);
    });
    var total = $("#total").val();
    var gt = parseFloat(total) + parseFloat(gstsum);
    $("#gtot").val(gt);
  };

  $(document).on("focus", "tr td", function (e) {
    myString = $(this).closest("tr").attr("itemid");
    counter = myString;

    var prnt = $(this).closest("tr").attr("itemid");

    var lst = Number(prnt) + Number(1);

    $(".addbtntext" + counter).focus(function () {
      if (document.getElementById("row" + lst) != null) {
      } else {
        counter++;
        no = counter + 1;

        var newRow = $(document.createElement("tr"))
          .attr("id", "row" + counter)
          .attr("itemid", counter);
        newRow.html(
          '<td><a id="del' +
            counter +
            '" href="#"> <i class="fa fa-trash" style="color: red;"aria-hidden="true"></i> </a></td><td><input type="number" min="0" class="form-control" id="hsn' +
            counter +
            '" name="hsn' +
            counter +
            '"></td><td><select name="prod' +
            counter +
            '" id="prod' +
            counter +
            '" placeholder="Select Product" class="product-select form-control" ><option selected>--------Select Product--------</option></select></td><td><input type="text" class="tot form-control" id="unit' +
            counter +
            '" name="unit' +
            counter +
            '" readonly ></td><td><input type="number" min="0" step="any" class="form-control" id="rate' +
            counter +
            '" name="rate' +
            counter +
            '"></td><td><input type="number" min="0" class="form-control" id="qty' +
            counter +
            '" name="qty' +
            counter +
            '"></td><td><input type="number" min="0" step="any" class="addbtntext' +
            counter +
            ' form-control" id="gstp' +
            counter +
            '" name="gstp' +
            counter +
            '"></td><td><input type="number" class="gstamt form-control" id="gstamt' +
            counter +
            '" name="gstamt' +
            counter +
            '"readonly  ></td><td><input type="text" class="tot form-control" id="tot' +
            counter +
            '" name="tot' +
            counter +
            '" readonly ></td>'
        );
        newRow.appendTo("#itemtable");

        $(".product-select").select2();
        for (var i = 0; i < product_data.length; i++) {
          console.log(product_data);
          $("#prod" + counter).append(
            '<option value="' +
              product_data[i].productName +
              '">' +
              product_data[i].productName +
              "</option>"
          );
        }
        $.ajax({
          method: "post",
          url: "/purchase/count",
          data: { count: counter },
          success: (data) => {
            console.log(data);
          },
        });
      }
    });

    $("#prod" + counter).change(function () {
      var pname = $("#prod" + counter).val();
      var product = product_data.find((p) => {
        return p.productName == pname;
      });
      $("#unit" + counter).val(product.unit);
      $("#rate" + counter).val(product.sellingPrice);
    });

    var id = $(this).closest("tr").attr("itemid");
    $("#qty" + id).keyup(() => {
      calculate(id);
    });

    $("#rate" + id).keyup(() => {
      calculate(id);
    });

    $(".addbtntext" + id).keyup(() => {
      calculate(id);
    });

    $("#del" + id).click(() => {
      if ($("#row" + counter).attr("itemid") == 0) {
      } else {
        var sum = 0;
        $("tr")
          .find(".tot")
          .each(function () {
            if (!isNaN(this.value) && this.value.length != 0) {
              sum += parseFloat(this.value);
            }
          });
        // gst calculate
        if (supplier_state == profile_state) {
          var gstsum = 0;
          $("tr")
            .find(".gstamt")
            .each(function () {
              if (!isNaN(this.value) && this.value.length != 0) {
                gstsum += parseFloat(this.value);
              }
            });
          var cgst = gstsum / 2;
          $("#cgst").val(cgst);
          $("#sgst").val(cgst);
        } else {
          var gstsum = 0;
          $("tr")
            .find(".gstamt")
            .each(function () {
              if (!isNaN(this.value) && this.value.length != 0) {
                gstsum += parseFloat(this.value);
              }
            });
          $("#igst").val(gstsum);
        }
        $("#total").val(sum);
        $("#row" + counter).remove();
        var total = $("#total").val();
        var roff = $("#roff").val();
        var gt =
          parseFloat(total) + parseFloat(gstsum) - parseFloat(roff ? roff : 0);
        $("#gtot").val(gt);
      }
    });
  });
});
