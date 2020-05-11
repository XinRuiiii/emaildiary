<template>
    <div>
        <wired-input id="diaryTitleInput" :value="editingDiaryTitle" @input="editingDiaryTitle=$event.target.value"
                     @change="onEditorChange($event)"
                     placeholder="日记标题" elevation="2"/>
        <wired-card id="diaryTextInput">
            <quill-editor id="diaryContent"
                          v-model="editingDiaryText"
                          ref="myQuillEditor"
                          :options="editorOption"
                          @change="onEditorChange($event)">
            </quill-editor>
        </wired-card>
    </div>
</template>

<script>
    import Quill from 'quill'

    // quill 编辑器的字体
    var fonts = ['naughty-lite-2']
    var Font = Quill.import('formats/font')
    Font.whitelist = fonts;
    Quill.register(Font, true);

    export default {
        name: "DiaryEditor",
        props: [
            'diaryTitle',
            'diaryText'
        ],
        data() {
            return {
                editingDiaryTitle: this.diaryTitle,
                editingDiaryText: this.diaryText,
                editorOption: {
                    placeholder: '记录下你的一天吧',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],        // 切换按钮
                            ['blockquote', 'code-block'],
                            [{'header': 1}, {'header': 2}],               // 标题 1，2
                            [{'list': 'ordered'}, {'list': 'bullet'}],    //有序， 无序列表
                            [{'script': 'sub'}, {'script': 'super'}],      // 上标/下标
                            [{'indent': '-1'}, {'indent': '+1'}],          // 缩进
                            [{'direction': 'rtl'}],                         // 文本方向
                            [{'size': ['small', false, 'large', 'huge']}],  // 自定义下拉
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],
                            [{'color': []}, {'background': []}],          // 具有主题默认值的下拉列表
                            [{'font': fonts}],
                            [{'align': []}],
                            ['clean'],
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

    #diaryTitleInput {
        width: 100%;
    }
</style>
