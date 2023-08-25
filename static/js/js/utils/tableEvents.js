var ParamsTable = {
    tagFormatter(value, row, index, field) {
        if (!row.tags.length) return '';

        if (row.tags.length < 3) {
            const listTagsBtn = row.tags.map(tag =>
                `<button class="btn btn-xs btn-painted mr-1 rounded-pill"
                style="--text-color: ${tag.hex}; --brd-color: ${tag.hex}">${tag.title}
            </button>`
            )
            return listTagsBtn.join('');
        }

        const firstTag = row.tags[0];
        const firstTagBtn = `<button class="btn btn-xs btn-painted mr-1 rounded-pill"
            style="--text-color: ${firstTag.hex}; --brd-color: ${firstTag.hex}">${firstTag.title}
        </button>`

        const listTagsInfo = row.tags.slice(1).map(tag =>
            `<div class="my-1 mx-3">
                <button class="btn btn-xs btn-painted rounded-pill pl-2.5 pr-2.5" style="--text-color: ${tag.hex }; --brd-color: ${tag.hex}">
                    ${tag.title}
                </button>
            </div>`).join("");
        const sizeTags = row.tags.slice(1).length;
        const randomId = `listtooltip_${new Date() + Math.floor(Math.random() * 1000)}`
        const infoTags = `<button
                                class="btn btn-xs btn-painted btn-painted__size rounded-pill px-2"
                                style="--text-color: #757F99; --brd-color: #EAEDEF"
                                data-toggle="${randomId}"
                                data-html="true"
                                data-offset="80% 20%"
                                title="true">
                                + ${sizeTags}
                          </button>`

        setTimeout(() => {
            const attrTooltip = `[data-toggle="${randomId}"]`
            $(attrTooltip).tooltip({
                sanitize: false,
                boundary: 'body',
                template: `
                    <div class="tooltip tooltip__custom" role="tooltip">
                        <div class="tooltip-inner__custom d-flex flex-column">
                            ${listTagsInfo}
                        </div>
                    </div>
                `
            })
        },0);
        return `${firstTagBtn}${infoTags}`
    },
    parametersDeleteFormatter(value, row, index) {
        return `
            <button type="button" class="btn btn-default btn-xs btn-table btn-icon__xs" 
                onclick="ParamsTable.deleteParams(${index}, this, '${row.id}')">
                <i class="icon__18x18 icon-delete"></i>
            </button>
        `
    },
    textareaFormatter(value, row, index, field) {
        return `
            <div class="pb-1 position-relative">
                <textarea class="form-control form-control-alternative"
                    rows="3"
                    onchange="ParamsTable.updateCell(this, ${index}, '${field}', '${row.id}')" 
                    value="${value}">${value}</textarea>
            </div>
        `
    },
    deleteParams: (index, source, exampleId) => {
        const $table = $(source).closest('.params-table').bootstrapTable('remove', {
            field: '$index',
            values: [index]
        })
        $table.bootstrapTable('getData').length === 0 && $table.addClass('empty_data');
        if (exampleId.length < 10) vueVm.registered_components['prompts-params'].deleteExample(exampleId);
    },
    updateCell: (el, row, field, id) => {
        $(el.closest('table')).bootstrapTable(
            'updateCell',
            {index: row, field: field, value: el.value}
        )
        if (id.length > 10) {
            vueVm.registered_components['prompts-params'].checkFields(id);
        } else {
            $(`#promptsParamsTable tr[data-uniqueid=${id}]`).find('textarea').each(function () {
                $(this).attr('disabled', 'disabled')
            })
            vueVm.registered_components['prompts-params'].updateField(id);
        }

    },
}


var VariableTable = {
    deleteFormatter(value, row, index) {
        return `
            <button type="button" class="btn btn-default btn-xs btn-table btn-icon__xs" 
                onclick="VariableTable.deleteParams(${index}, this, '${row.id}')">
                <i class="icon__18x18 icon-delete"></i>
            </button>
        `
    },
    textareaFormatter(value, row, index, field) {
        return `
            <div class="pb-1 position-relative">
                <textarea class="form-control form-control-alternative"
                    rows="1"
                    onchange="VariableTable.updateCell(this, ${index}, '${field}', '${row.id}')" 
                    value="${value}">${value}</textarea>
            </div>
        `
    },
    deleteParams: (index, source, varId) => {
        const $table = $(source).closest('.params-table').bootstrapTable('remove', {
            field: '$index',
            values: [index]
        })
        $table.bootstrapTable('getData').length === 0 && $table.addClass('empty_data');
        if (varId.length < 10) vueVm.registered_components['prompts-params'].deleteVariable(varId);
    },

    updateCell: (el, row, field, id) => {
        $(el.closest('table')).bootstrapTable(
            'updateCell',
            {index: row, field: field, value: el.value}
        )
        if (id.length > 10) {
            vueVm.registered_components['prompts-params'].checkVariableFields(id);
        } else {
            $(`#variablesTable tr[data-uniqueid=${id}]`).find('textarea').each(function () {
                $(this).attr('disabled', 'disabled')
            })
            vueVm.registered_components['prompts-params'].updateVariableField(id);
        }

    },
}