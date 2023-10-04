function highlightOnClick() {
    const selectedUniqId = this.getAttribute('data-uniqueid');
    const selected = vueVm.registered_components['prompts'].promptsList.find(row => row.id === +selectedUniqId);
    $(this).addClass('highlight').siblings().removeClass('highlight');
    vueVm.registered_components['prompts'].FetchPromptById(selected.id);
}

const Prompts = {
    components: {
        "prompts-list-aside": PromptsListAside,
        "prompts-modal-create": PromptsModalCreate,
        "prompts-params": PromptsParams,
        "prompts-confirm-modal": PromptsConfirmModal,
        "prompts-version-modal-create": PromptsVersionModalCreate,
    },
    props: ['integrations'],
    data() {
        return {
            selectedPrompt: {
                id: null
            },
            showCreateModal: false,
            showCreateVersionModal: false,
            modalType: 'create',
            modalVersionType: 'create',
            promptsList: [],
            showConfirm: false,
            loadingDelete: false,
            isPromptListLoading: false,
            isPromptLoading: false,
            isModalLoading: false,
            isVersionModalLoading: false,
            isTagsLoaded: false,
        }
    },
    mounted() {
        $(document).on('vue_init', () => {
            this.isPromptListLoading = true;
            ApiFetchPrompts().then(data => {
                $("#prompts-aside-table").bootstrapTable('append', data);
                this.promptsList = data;
                if (data.length > 0) {
                    const hash_id = location.hash.substring(1)
                    this.selectedPrompt = data.find(i => hash_id === String(i.id)) || data[0];
                    this.setBucketEvents();
                    this.selectActivePrompt();
                }
                this.isPromptListLoading = false;
            })
        })
    },
    watch: {
        selectedPrompt(newValue) {
            location.hash = newValue.id
        }
    },
    methods: {
        FetchPromptById(promptId) {
            this.isPromptLoading = true;
            ApiFetchPromptById(promptId).then(data => {
                this.isPromptLoading = false;
                this.selectedPrompt = {...data};
            })
        },
        setBucketEvents() {
            $('#prompts-aside-table').on('click', 'tbody tr:not(.no-records-found)', highlightOnClick);
        },
        selectActivePrompt() {
            this.FetchPromptById(this.selectedPrompt.id);
            const selected_id = this.selectedPrompt?.id
            if (selected_id !== undefined) {
                $(`#prompts-aside-table tbody tr[data-uniqueid=${selected_id}]`).addClass('highlight')
            }

        },
        openCreateModal(modalType, prompt = '') {
            this.showCreateModal = true;
        },
        openCreateVersionModal(modalVersionType, prompt = '') {
            this.showCreateVersionModal = true;
        },
        handleCreatePrompt(newRoleName) {
            this.isModalLoading = true;
            ApiCreatePrompt(newRoleName, this.selectedMode).then(data => {
                this.refreshPromptsListTable(data.id);
                this.isModalLoading = false;
                this.showCreateModal = false;
            });
        },
        handleCreatePromptVersion(newVersionName) {
            this.isVersionModalLoading = true;
            ApiCreatePromptVersion(this.selectedPrompt.id, newVersionName).then(data => {
                this.FetchPromptById(data.id);
                this.isVersionModalLoading = false;
                this.showCreateVersionModal = false;
            });
        },
        deletePrompt() {
            this.loadingDelete = true;
            ApiDeletePrompt(this.selectedPrompt.id).then(data => {
                showNotify('SUCCESS', 'Prompt delete.');
                this.loadingDelete = false;
                this.showConfirm = !this.showConfirm;
                this.refreshPromptsListTable()
            });
        },
        refreshPromptsListTable(promptId = null) {
            ApiFetchPrompts().then(data => {
                $('#prompts-aside-table').off('click', 'tbody tr:not(.no-records-found)', highlightOnClick);
                $("#prompts-aside-table").bootstrapTable('load', data);
                this.promptsList = data;
                this.setBucketEvents();
                if (promptId) {
                    this.selectedPrompt = data.find(row => row.id === promptId);
                    $('#prompts-aside-table').find(`[data-uniqueid='${promptId}']`).addClass('highlight');
                    this.FetchPromptById(promptId);
                } else {
                    if (data.length > 0) {
                        this.selectedPrompt = data[0];
                        this.selectActivePrompt();
                    }
                }
            });
        },
        openConfirm() {
            this.showConfirm = !this.showConfirm;
        },
        refreshPage() {
            window.location.reload();
        }
    },
    template: `
        <div class="p-3">
            <div v-if="integrations.length === 0">
                <div class="card w-100" style="height: calc(100vh - 92px)">
                    <div class="d-flex justify-content-center align-items-center h-100">
                        <div class="d-flex flex-column align-items-center">
                            <p class="font-h4 text-gray-700">Need to
                                <a href="/-/configuration/integrations/" target="_blank">require AI integration,</a>
                                before creating prompts.
                            </p>
                            <button type="button" class="btn btn-sm btn-secondary btn-icon__purple mt-1"
                                @click="refreshPage">
                                <i class="icon__14x14 icon-refresh mr-2"></i>Refresh page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="d-flex gap-4">
                    <prompts-list-aside
                        @register="$root.register"
                        instance_name="prompts-list-aside"
                        :selectedPrompt="selectedPrompt"
                        @open-create-modal="openCreateModal">
                    </prompts-list-aside>
                    <div class="position-relative flex-grow-1 card" v-if="isPromptListLoading">
                        <div class="layout-spinner">
                            <div class="spinner-centered">
                                <i class="spinner-loader__32x32"></i>
                            </div>
                        </div>
                    </div>
                    <template v-else>
                        <template v-if="promptsList.length > 0">
                            <prompts-params
                                class="flex-grow-1"
                                @open-create-version-modal="openCreateVersionModal"
                                @register="$root.register"
                                instance_name="prompts-params"
                                :selected-prompt="selectedPrompt"
                                :integrations="integrations"
                                :is-prompt-loading="isPromptLoading"
                            ></prompts-params>
                        </template>
                        <div v-else class="card w-100">
                            <div class="d-flex justify-content-center align-items-center h-100">
                                <div class="d-flex flex-column align-items-center">
                                    <p class="font-h5 text-gray-500">Still no prompts created.</p>
                                    <button type="button" class="btn btn-sm btn-secondary mt-1"
                                        @click="openCreateModal">
                                        <i class="fas fa-plus mr-2"></i>Create prompt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <transition>
                <prompts-modal-create
                    v-if="showCreateModal"
                    @close-create-modal="showCreateModal = false"
                    @save-prompt="handleCreatePrompt"
                    @update-prompt="handleCreatePrompt"
                    :modalType="modalType"
                    :editableRoles="editableRoles"
                    :isModalLoading="isModalLoading">
                </prompts-modal-create>
            </transition>
            <transition>
                <prompts-version-modal-create
                    v-if="showCreateVersionModal"
                    @close-create-version-modal="showCreateVersionModal = false"
                    @save-version="handleCreatePromptVersion"
                    @update-version="handleCreatePromptVersion"
                    :modal-version-type="modalVersionType"
                    :is-version-modal-loading="isVersionModalLoading">
                </prompts-version-modal-create>
            </transition>
            <transition>
                <prompts-confirm-modal
                    v-if="showConfirm"
                    @close-confirm="openConfirm"
                    :loading-delete="loadingDelete"
                    @delete-prompt="deletePrompt">
                </prompts-confirm-modal>
            </transition>
        </div>
    `
}

register_component('prompts', Prompts);
