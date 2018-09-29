for (i = 0; i < res.length; i++) {
                var newOption = new Option(res[i]["name"], i, false, false);
                repoSelect.append(newOption).trigger('change');

                
            }