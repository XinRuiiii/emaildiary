<template>
    <div class="diary">
        <wired-input id="diaryTitleInput" :value="editingDiaryTitle"
                     @input="editingDiaryTitle=$event.target.value"
                     @change="onEditorChange($event)"
                     placeholder="日记标题" elevation="2"
                     :style="{width:editorWidth+'px'}"/>
        <wired-card id="diaryTextInput" fill="#f3d2c1">
            <div :style="{height:editorHeight+'px'}">
                <quill-editor id="diaryContent"
                              v-model="editingDiaryText"
                              ref="myQuillEditor"
                              :options="editorOption"
                              @change="onEditorChange($event)"
                              :style="{width:editorWidth+'px',height:editorHeight*0.8+'px'}">
                </quill-editor>
            </div>
        </wired-card>
    </div>
</template>

<script>
    import Quill from 'quill'


    let fonts = ['naughty-lite-2']
    let Font = Quill.import('formats/font')
    Font.whitelist = fonts;
    Quill.register(Font, true);

    export default {
        name: "DiaryEditor",
        props: [
            'diaryTitle',
            'diaryText',
            'editorWidth',
            'editorHeight'
        ],
        data() {
            return {

                editingDiaryTitle: this.diaryTitle,
                editingDiaryText: this.diaryText,
                editorOption: {
                    placeholder: '记录下你的一天吧',
                    modules: {
                        toolbar: [
                            [{'font': fonts}],
                            ['bold', 'italic', 'underline', 'strike'],        // 切换按钮
                            [{'color': []}, {'background': []}],          // 具有主题默认值的下拉列表
                            ['blockquote'],
                            [{'header': 1}, {'header': 2}],               // 标题 1，2
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],
                            [{'list': 'ordered'}, {'list': 'bullet'}],    //有序， 无序列表
                            [{'indent': '-1'}, {'indent': '+1'}],          // 缩进
                            [{'direction': 'rtl'}],                         // 文本方向
                            [{'align': []}],
                            ['clean']
                        ]
                    },
                    theme: 'snow'
                }
            }
        },
        methods: {
            onEditorChange: function () {
                this.$emit('update:diaryTitle', this.editingDiaryTitle)
                this.$emit('update:diaryText', this.editingDiaryText)
            }
        }
    }
</script>

<style scoped>
    .diary {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #diaryTextInput {
        margin-top: 2%;
    }

</style>
