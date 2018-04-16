package ch.japt.epj.model;

import ch.japt.epj.model.dto.NewAnswerDto;
import ch.japt.epj.model.dto.NewExerciseDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest(includeFilters = @ComponentScan.Filter(Component.class))
public class TaskModelTests {
    @Autowired
    private TaskModel model;

    @Test
    public void shouldContainTasks() {
        assertThat(model.allExercises().size()).isEqualTo(10);
    }

    @Test
    public void emptyWhenNotFound() {
        assertThat(model.getExercise(11l)).isEmpty();
    }

    @Test
    public void shouldAddNewTask() {
        assertThat(model.getExercise(11l)).isEqualTo(Optional.empty());
        NewAnswerDto yes = new NewAnswerDto().text("Yes").checked(true);
        NewAnswerDto no = new NewAnswerDto().text("No").checked(false);

        NewExerciseDto dto = new NewExerciseDto()
                .title("Unit Test Question")
                .question("Is this a unit test?")
                .answers(Arrays.asList(new NewAnswerDto[]{yes, no}));

        model.addExercise(dto);
        assertThat(model.getExercise(11l)).isNotEmpty();
    }
}
