<template>
  <div>
    <b-form @submit="submit">
      <b-row v-for="(cl, name, i) in form" :key="i">
        <b-col cols="12">
          <b-form-group
            :id="`input-group-${i}`"
            :label="cl.label ? cl.label : name[0].toUpperCase() + name.slice(1)"
            :label-for="`input-${i}`"
            :description="cl.description"
            label-cols-lg="4"
          >
            <b-input-group :append="cl.append" >
              <b-form-checkbox
                v-if="cl.type == 'checkbox' || cl.type == 'switch'"
                :switch="cl.type == 'switch'"
                v-model="cl.data"
                :style="`margin-top: ${
                  cl.type == 'switch' ? '0.35rem' : '0.5rem'
                }`"
                :required="cl.required || required"
              >
                {{
                  cl.states.length > 1
                    ? cl.states[Number(!cl.data)]
                    : cl.states[0]
                }}
              </b-form-checkbox>
              <flatpickr
                v-model="cl.data"
                v-else-if="cl.type == 'date'"
                style="background-color: white"
                class="form-control"
                :config="{
                  altInput: true,
                  enableTime: true,
                  dateFormat: 'Y-m-d H:i',
                }"
              />
              <b-form-textarea
                v-else-if="cl.type == 'textarea'"
                :placeholder="cl.placeholder"
                rows="3"
                :required="cl.required || required"
                v-model="cl.data"
                no-resize
              />
              <b-form-input
                :id="`input-${i}`"
                v-model="cl.data"
                v-else
                :type="cl.type ? cl.type : 'text'"
                :placeholder="cl.placeholder"
                :list="cl.list ? 'input-list' : ''"
                :required="cl.required || required"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-datalist v-if="cl.list" id="input-list" :options="cl.list" />
        </b-col>
      </b-row>
      <b-col offset-lg="4">
        <b-button v-ripple type="submit" class="mt-1 -ml-1.5">OK</b-button>
      </b-col>
    </b-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          email: {
            label: 'A Quote',
            placeholder: 'You know we Need It',
            data: '',
          },
          message: {
            label: 'Message',
            placeholder: 'You know we Need It',
            data: '',
          },
        };
      },
    },
    required: {
      type: Boolean,
    },
  },
  methods: {
    submit(event) {
      event.preventDefault();
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped></style>
